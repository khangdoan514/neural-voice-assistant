from ..utils.conversation_manager import ConversationManager
from ..utils.file_handler import save_conversation
from ..utils.intent_detector import users_say_yes, users_say_no
from ..services.openai_service import transcribe_audio, generate_speech
from ..services.advanced_openai_service import generate_advanced_response
from ..services.twilio_service import validate_twilio_signature

from config import Config
from flask import Blueprint, request, send_file # type: ignore
from twilio.twiml.voice_response import VoiceResponse # type: ignore

import os
import uuid

# Create blueprint
call_bp = Blueprint('call_routes', __name__)

# Initialize conversation manager
conversation_manager = ConversationManager()

@call_bp.route('/audio/<call_sid>/<filename>')
def serve_audio(call_sid, filename):
    # Serve generated audio files to Twilio
    audio_path = f"/tmp/{call_sid}_{filename}"
    
    if os.path.exists(audio_path):
        return send_file(audio_path, mimetype='audio/mpeg')
    
    else:
        print(f"ERROR: No audio file found in serve_audio()")
        return "Audio not found", 404

def generate_audio_response(response, call_sid, text, language='en'):    
    # Generate speech file
    voice = "nova" if language == 'en' else "shimmer"
    audio_file = generate_speech(text, voice)
    
    if not audio_file:
        # Use Twilio TTS
        if language == 'vi':
            response.say(text, voice='alice', language='vi-VN')
        
        else:
            response.say(text, voice='alice', language='en-US')
        
        return
    
    # Move to permanent location
    final_filename = f"response_{uuid.uuid4().hex[:8]}.mp3"
    final_path = f"/tmp/{call_sid}_{final_filename}"
    os.rename(audio_file, final_path)
    
    # Get base URL for audio serving
    base_url = request.url_root.rstrip('/')
    audio_url = f"{base_url}/twilio/audio/{call_sid}/{final_filename}"
    
    # Play the audio instead of using text-to-speech
    response.play(audio_url)

@call_bp.route('/voice', methods=['POST'])
def handle_incoming_call():
    # Validate Twilio
    if not validate_twilio_signature(request):
        return "Invalid signature", 403

    # Handle incoming call to Twilio number
    response = VoiceResponse()
    call_sid = request.form.get('CallSid')
    phone_number = request.form.get('Caller')

    # Get the current base URL
    base_url = request.url_root.rstrip('/')

    print(f"Incoming call received: {call_sid}\n")
    print(f"User phone number: {phone_number}")

    if not call_sid:
        print("ERROR: No CallSid received in handle_incoming_call()")
        response.say("System error. Please try again later.", voice='alice')
        return str(response)

    # New conversation
    conversation_manager.start_conversation(call_sid, phone_number)

    # Current conversation state
    state = conversation_manager.get_conversation_state(call_sid)
    
    # Initial greeting
    generate_audio_response(response, call_sid, "Hi, I'm Salli, an artificial intelligence assistant. Would you prefer English or Vietnamese?", 'en')
    print("AI response: Hi, I'm Salli, an artificial intelligence assistant. Would you prefer English or Vietnamese?")
    print(f"Current conversation state: {state}\n")
    
    # User's response
    response.record(
        action=f'{base_url}/twilio/process-language-choice/{call_sid}',
        method='POST',
        timeout=Config.RECORDING_TIMEOUT,
        finish_on_key='#',
        play_beep=False,
        transcribe=False
    )

    return str(response)

@call_bp.route('/process-language-choice/<call_sid>', methods=['GET', 'POST'])
def process_language_choice(call_sid):
    # Validate Twilio
    if not validate_twilio_signature(request):
        return "Invalid signature", 403
    
    # Language preference
    response = VoiceResponse()
    recording_url = request.form.get('RecordingUrl') or request.args.get('RecordingUrl')
    
    if not recording_url:
        print("ERROR: No RecordingUrl found in process_language_choice()")
        generate_audio_response(response, call_sid, "Sorry, I didn't get that. Please call back again.", 'en')
        return str(response)
    
    # Transcribe the language preference
    transcript = transcribe_audio(recording_url)
    print(f"User response: '{transcript}'")
    
    # Determine language preference
    if any(word in transcript.lower() for word in ['vietnamese', 'tiếng việt', 'việt nam', 'việt']):
        language = 'vi'
        greeting = "Xin chào, hôm nay bạn cần giúp gì?"
    
    else:
        # Default to English
        language = 'en' 
        greeting = "Hi, what do you need help with today?"
    
    # Store language preference
    conversation_manager.set_language(call_sid, language)
    conversation_manager.update_conversation(call_sid, transcript, greeting, 'greeting')
    
    # Main question
    generate_audio_response(response, call_sid, greeting, language)
    print(f"AI response: {greeting}")
    
    # User's request
    response.record(
        action=f'{request.url_root.rstrip("/")}/twilio/process-recording/{call_sid}',
        method='POST',
        timeout=Config.RECORDING_TIMEOUT,
        finish_on_key='#',
        play_beep=False,
        transcribe=False
    )
    
    return str(response)

@call_bp.route('/process-user-info/<call_sid>', methods=['GET', 'POST'])
def process_user_info(call_sid):
    # User's name and location
    response = VoiceResponse()
    recording_url = request.form.get('RecordingUrl') or request.args.get('RecordingUrl')

    if not recording_url:
        print("ERROR: No RecordingUrl found in process_user_info()")
        return str(response)

    # Current language and conversation state
    language = conversation_manager.get_language(call_sid)
    state = conversation_manager.get_conversation_state(call_sid)
    
    # Use transcription
    transcript = transcribe_audio(recording_url, language)
    print(f"User response: '{transcript}'")
    
    # Process questions
    if state == 'asking_name':
        # Get user's name
        if transcript.strip():
            conversation_manager.set_user_info(call_sid, 'name', transcript)
            print(f"User response: {transcript}")
            
            # Ask for location
            if language == 'vi':
                generate_audio_response(response, call_sid, "Cảm ơn. Bạn có thể cho biết địa chỉ của bạn được không?", 'vi')
            
            else:
                generate_audio_response(response, call_sid, "Thank you. Could you please provide your address?", 'en')
                
            conversation_manager.update_conversation(call_sid, transcript, "Asking for location", 'asking_location')
        
        # Did not get user's name
        else:
            if language == 'vi':
                generate_audio_response(response, call_sid, "Xin vui lòng cho biết tên của bạn để chúng tôi có thể hỗ trợ bạn.", 'vi')
            
            else:
                generate_audio_response(response, call_sid, "Please provide your name so we can assist you.", 'en')
                
            conversation_manager.update_conversation(call_sid, transcript, "Asking for name again", 'asking_name')

    elif state == 'asking_location':
        # Get user's location
        if transcript.strip():
            conversation_manager.set_user_info(call_sid, 'location', transcript)
            print(f"User response: {transcript}")
            
            # Save conversation
            user_info = conversation_manager.get_user_info(call_sid)
            user_request = conversation_manager.get_user_request(call_sid)
            conversation_history = conversation_manager.get_conversation_history(call_sid)
            save_conversation(call_sid, user_info, user_request, conversation_history)

            if language == 'vi':
                generate_audio_response(response, call_sid, "Cảm ơn, yêu cầu của bạn đã được gửi đầy đủ. Chúng tôi sẽ hỗ trợ bạn sớm nhất có thể. Tạm biệt!", 'vi')
            
            else:
                generate_audio_response(response, call_sid, "Thank you, your request has been submitted with all your information. We'll make sure to help you as quickly as possible. Goodbye!", 'en')
            
            # Goodbye
            generate_audio_response(response, call_sid, "Cảm ơn, yêu cầu của bạn đã được gửi đầy đủ. Chúng tôi sẽ hỗ trợ bạn sớm nhất có thể. Tạm biệt!", 'vi')
            conversation_manager.end_conversation(call_sid)

            return str(response)

        # Did not get user's location
        else:
            if language == 'vi':
                generate_audio_response(response, call_sid, "Xin vui lòng cho biết địa chỉ của bạn để chúng tôi có thể cử nhân viên đến hỗ trợ.", 'vi')
            
            else:
                generate_audio_response(response, call_sid, "Please provide your address so we can send someone to assist you.", 'en')
                
            conversation_manager.update_conversation(call_sid, transcript, "Asking for location again", 'asking_location')
    
    # Continue collecting information
    response.record(
        action=f'{request.url_root.rstrip("/")}/twilio/process-user-info/{call_sid}',
        method='POST',
        timeout=Config.RECORDING_TIMEOUT,
        finish_on_key='#',
        play_beep=False,
        transcribe=False
    )
    
    return str(response)

@call_bp.route('/process-recording/<call_sid>', methods=['GET', 'POST'])
def process_recording(call_sid):
    # Process the recording after user speaks
    response = VoiceResponse()
    recording_url = request.form.get('RecordingUrl') or request.args.get('RecordingUrl')

    if not recording_url:
        print("ERROR: No RecordingUrl found in process_recording()")
        generate_audio_response(response, call_sid, "Sorry, I didn't get that. Please try again.", 'en')
        return str(response)

    # Get language preference
    language = conversation_manager.get_language(call_sid)

    # Use transcription
    transcript = transcribe_audio(recording_url, language)
    print(f"User response: '{transcript}'")

    # Current conversation state
    state = conversation_manager.get_conversation_state(call_sid)
    print(f"Conversation state: {state}\n")

    # Vietnamese flow 
    if language == 'vi':
        # Get user's info
        user_info = conversation_manager.get_user_info(call_sid)
        conversation_manager.set_user_request(call_sid, transcript)
        if user_info.get('name') is None:
            # Ask for name
            generate_audio_response(response, call_sid, "Để chúng tôi hỗ trợ tốt hơn, xin vui lòng cho biết tên của bạn?", 'vi')
            conversation_manager.update_conversation(call_sid, transcript, "Đang hỏi tên", 'asking_name')

            response.record(
                action=f'{request.url_root.rstrip("/")}/twilio/process-user-info/{call_sid}',
                method='POST',
                timeout=Config.RECORDING_TIMEOUT,
                finish_on_key='#',
                play_beep=False,
                transcribe=False
            )

        elif user_info.get('location') is None:
            # Ask for location
            generate_audio_response(response, call_sid, "Cảm ơn. Bạn có thể cho biết địa chỉ của bạn được không?", 'vi')
            conversation_manager.update_conversation(call_sid, transcript, "Đang hỏi địa chỉ", 'asking_location')
            
            response.record(
                action=f'{request.url_root.rstrip("/")}/twilio/process-user-info/{call_sid}',
                method='POST',
                timeout=Config.RECORDING_TIMEOUT,
                finish_on_key='#',
                play_beep=False,
                transcribe=False
            )

        return str(response)
    
    # English flow
    else:
        # Conversation history
        conversation_history = conversation_manager.get_conversation_history(call_sid)
        
        # Generate AI response based on state
        ai_response = generate_advanced_response(transcript, state, conversation_history, language)
        
        if state == 'greeting':
            # Confirm user response
            conversation_manager.set_user_request(call_sid, transcript)
            conversation_manager.update_conversation(call_sid, transcript, ai_response, 'confirmation')
            
            generate_audio_response(response, call_sid, ai_response, language)

            response.record(
                action=f'{request.url_root.rstrip("/")}/twilio/process-confirmation/{call_sid}',
                method='POST',
                timeout=Config.RECORDING_TIMEOUT,
                finish_on_key='#',
                play_beep=False,
                transcribe=False
            )
            
        elif state == 'confirmation':
            ai_confirmation_response = conversation_history[-1]['ai'] if conversation_history else ""
            print(f"AI response: '{ai_confirmation_response}'")
            
            final_confirmation = [
                "Is that all you need help with?",
                "Okay, is that all you need help with?",
                "Có phải đó là tất cả những gì bạn cần giúp không?",
                "Được rồi, có phải đó là tất cả những gì bạn cần giúp không?"
            ]

            # Final confirmation
            if any(phrase in ai_confirmation_response for phrase in final_confirmation):
                # Users say "yes"
                if users_say_yes(transcript.lower()):
                    # Get user's info
                    user_info = conversation_manager.get_user_info(call_sid)

                    if user_info.get('name') is None:
                        # Ask for name
                        generate_audio_response(response, call_sid, "To better assist you, could you please tell me your name?", 'en')
                        conversation_manager.update_conversation(call_sid, transcript, "Asking for name", 'asking_name')
                        
                        response.record(
                            action=f'{request.url_root.rstrip("/")}/twilio/process-user-info/{call_sid}',
                            method='POST',
                            timeout=Config.RECORDING_TIMEOUT,
                            finish_on_key='#',
                            play_beep=False,
                            transcribe=False
                        )
                    
                    elif user_info.get('location') is None:
                        # Ask for location
                        generate_audio_response(response, call_sid, "Thank you. Could you please provide your address?", 'en')
                        conversation_manager.update_conversation(call_sid, transcript, "Asking for location", 'asking_location')
                        
                        response.record(
                            action=f'{request.url_root.rstrip("/")}/twilio/process-user-info/{call_sid}',
                            method='POST',
                            timeout=Config.RECORDING_TIMEOUT,
                            finish_on_key='#',
                            play_beep=False,
                            transcribe=False
                        )
                
                # User say "no"
                elif users_say_no(transcript.lower()):
                    # Ask what else they need help with
                    conversation_manager.update_conversation(call_sid, transcript, ai_response, 'greeting')
                    
                    # Follow-up
                    generate_audio_response(response, call_sid, "How can I assist you further?", 'en')

                    response.record(
                        action=f'{request.url_root.rstrip("/")}/twilio/process-recording/{call_sid}',
                        method='POST',
                        timeout=Config.RECORDING_TIMEOUT,
                        finish_on_key='#',
                        play_beep=False,
                        transcribe=False
                    )

                # User say something else
                else:
                    # Ask user to repeat final confirmation
                    conversation_manager.update_conversation(call_sid, transcript, ai_response, 'confirmation')
                    generate_audio_response(response, call_sid, ai_response, language)

                    response.record(
                        action=f'{request.url_root.rstrip("/")}/twilio/process-confirmation/{call_sid}',
                        method='POST',
                        timeout=Config.RECORDING_TIMEOUT,
                        finish_on_key='#',
                        play_beep=False,
                        transcribe=False
                    )

            # Confirm what users say
            else:
                # Users say "yes"
                if users_say_yes(transcript.lower()):
                    # Ask if that's all they need
                    conversation_manager.update_conversation(call_sid, transcript, ai_response, 'confirmation')
                    generate_audio_response(response, call_sid, ai_response, language)

                    response.record(
                        action=f'{request.url_root.rstrip("/")}/twilio/process-confirmation/{call_sid}',
                        method='POST',
                        timeout=Config.RECORDING_TIMEOUT,
                        finish_on_key='#',
                        play_beep=False,
                        transcribe=False
                    )

                # Users say "no"
                elif users_say_no(transcript.lower()):
                    # Ask user to repeat - go back to greeting
                    conversation_manager.update_conversation(call_sid, transcript, ai_response, 'greeting')
                    generate_audio_response(response, call_sid, ai_response, language)

                    response.record(
                        action=f'{request.url_root.rstrip("/")}/twilio/process-recording/{call_sid}',
                        method='POST',
                        timeout=Config.RECORDING_TIMEOUT,
                        finish_on_key='#',
                        play_beep=False,
                        transcribe=False
                    )

                # Users say something else
                else:
                    # Ask user to repeat
                    conversation_manager.update_conversation(call_sid, transcript, ai_response, 'confirmation')
                    generate_audio_response(response, call_sid, ai_response, language)

                    response.record(
                        action=f'{request.url_root.rstrip("/")}/twilio/process-confirmation/{call_sid}',
                        method='POST',
                        timeout=Config.RECORDING_TIMEOUT,
                        finish_on_key='#',
                        play_beep=False,
                        transcribe=False
                    )
        
        return str(response)

@call_bp.route('/process-confirmation/<call_sid>', methods=['GET', 'POST'])
def process_confirmation(call_sid):
    return process_recording(call_sid)