from ..utils.conversation_manager import ConversationManager
from ..utils.file_handler import save_conversation
from ..services.openai_service import transcribe_audio
from ..services.advanced_openai_service import generate_advanced_response
from flask import Blueprint, request # type: ignore
from twilio.twiml.voice_response import VoiceResponse # type: ignore
import random

# Create blueprint
call_bp = Blueprint('call_routes', __name__)

# Initialize conversation manager
conversation_manager = ConversationManager()

@call_bp.route('/voice', methods=['POST'])
def handle_incoming_call():
    # Handle incoming call to Twilio number
    response = VoiceResponse()
    call_sid = request.form.get('CallSid')

    # Get the current base URL
    base_url = request.url_root.rstrip('/')

    print(f"Incoming call received: {call_sid}\n")

    if not call_sid:
        print("ERROR: No CallSid received from Twilio.")
        response.say("System error. Please try again later.", voice='alice')
        return str(response)

    # New conversation
    conversation_manager.start_conversation(call_sid)

    # Current conversation state
    state = conversation_manager.get_conversation_state(call_sid)
    
    # Initial greeting
    response.say("Hi, I'm Alice, an artificial intelligence assistant. Would you prefer English or Vietnamese?", voice='alice')
    print("AI response: Hi, I'm Alice, an artificial intelligence assistant. Would you prefer English or Vietnamese?")
    print(f"Current conversation state: {state}\n")
    
    # User's response
    response.record(
        action=f'{base_url}/twilio/process-language-choice/{call_sid}',
        method='POST',
        timeout=4, # 4 seconds wait
        finish_on_key='#',
        # play_beep=True,
        transcribe=False
    )

    return str(response)

@call_bp.route('/process-language-choice/<call_sid>', methods=['GET', 'POST'])
def process_language_choice(call_sid):
    # Language preference
    response = VoiceResponse()
    recording_url = request.form.get('RecordingUrl') or request.args.get('RecordingUrl')
    
    if not recording_url:
        print("ERROR: No RecordingUrl found for language choice.")
        response.say("Sorry, I didn't get that. Please call back again.", voice='alice')
        return str(response)
    
    # Transcribe the language preference
    transcript = transcribe_audio(recording_url)
    print(f"User response: '{transcript}'")
    
    # Determine language preference
    if any(word in transcript.lower() for word in ['vietnamese', 'tiếng việt', 'việt nam', 'việt']):
        language = 'vi'
        greeting = "Xin chào, tôi là Salli, trợ lý ảo. Hôm nay bạn cần giúp gì?"
    
    else:
        # Default to English
        language = 'en' 
        greeting = "Hi, I'm Salli. What do you need help with today?"
    
    # Store language preference
    conversation_manager.set_language(call_sid, language)
    conversation_manager.update_conversation(call_sid, transcript, greeting, 'greeting')

    print(f"DEBUG: Language set to {language}, state updated to greeting")
    
    # Main question
    #response.say(greeting, voice='Polly.Thi')
    current_language = conversation_manager.get_language(call_sid)

    if current_language == 'vi':
        response.say(greeting, voice='alice', language='vi-VN')
    
    else:
        response.say(greeting, voice='alice', language='en-US')

    print(f"AI response: {greeting}")
    
    # User's request
    response.record(
        action=f'{request.url_root.rstrip("/")}/twilio/process-recording/{call_sid}',
        method='POST',
        timeout=4, # 4 seconds wait
        finish_on_key='#',
        # play_beep=True,
        transcribe=False
    )
    
    return str(response)

@call_bp.route('/process-recording/<call_sid>', methods=['GET', 'POST'])
def process_recording(call_sid):
    # Process the recording after user speaks
    response = VoiceResponse()
    recording_url = request.form.get('RecordingUrl') or request.args.get('RecordingUrl')

    if not recording_url:
        print("ERROR: No RecordingUrl found in request.")
        response.say("Sorry, I didn't get that. Please try again.", voice='alice')
        return str(response)

    # Get language preference
    language = conversation_manager.get_language(call_sid)

    # Use transcription
    transcript = transcribe_audio(recording_url, language)
    print(f"User response: '{transcript}'")

    # Current conversation state
    state = conversation_manager.get_conversation_state(call_sid)
    print(f"Conversation state: {state}\n")

    # Conversation history
    conversation_history = conversation_manager.get_conversation_history(call_sid)
    
    # Generate AI response based on state
    ai_response = generate_advanced_response(transcript, state, conversation_history, language)
    
    if state == 'greeting':
        # Confirm user response
        conversation_manager.set_user_request(call_sid, transcript)
        conversation_manager.update_conversation(call_sid, transcript, ai_response, 'confirmation')
        
        #response.say(ai_response, voice='Polly.Thi')
        current_language = conversation_manager.get_language(call_sid)
        if current_language == 'vi':
            response.say(ai_response, voice='alice', language='vi-VN')
        
        else:
            response.say(ai_response, voice='alice', language='en-US')

        response.record(
            action=f'{request.url_root.rstrip("/")}/twilio/process-confirmation/{call_sid}',
            method='POST',
            timeout=4, # 4 seconds wait
            finish_on_key='#'
        )
        
    elif state == 'confirmation':
        ai_confirmation_response = conversation_history[-1]['ai'] if conversation_history else ""
        final_confirmation = [
            "Is that all you need help with?",
            "Có phải đó là tất cả những gì bạn cần giúp không?"
        ]

        # Final confirmation
        if any(phrase in ai_confirmation_response for phrase in final_confirmation):
            # Users say "yes"
            if users_say_yes(transcript.lower()):
                # Save conversation
                user_request = conversation_manager.get_user_request(call_sid)
                save_conversation(call_sid, user_request, conversation_history)
                
                # Goodbye
                if language == 'vi':
                    #response.say("Cảm ơn, yêu cầu của bạn đã được gửi. Chúng tôi sẽ hỗ trợ bạn sớm nhất có thể. Tạm biệt!", voice='Polly.Thi')
                    response.say("Cảm ơn, yêu cầu của bạn đã được gửi. Chúng tôi sẽ hỗ trợ bạn sớm nhất có thể. Tạm biệt!", voice='alice', language='vi-VN')
                    print("Cảm ơn, yêu cầu của bạn đã được gửi. Chúng tôi sẽ hỗ trợ bạn sớm nhất có thể. Tạm biệt!")
                
                else:
                    #response.say("Thank you, your request has been submitted. We'll make sure to help you as quickly as possible. Goodbye!", voice='Polly.Thi')
                    response.say("Thank you, your request has been submitted. We'll make sure to help you as quickly as possible. Goodbye!", voice='alice', language='en-US')
                    print("AI response: Thank you, your request has been submitted. We'll make sure to help you as quickly as possible. Goodbye!")
                
                # End call
                conversation_manager.end_conversation(call_sid)
            
            # User say "no"
            elif users_say_no(transcript.lower()):
                # Ask what else they need help with
                conversation_manager.update_conversation(call_sid, transcript, ai_response, 'greeting')
                
                # Follow-up
                if language == 'vi':
                    #response.say("Tôi có thể giúp gì thêm cho bạn?", voice='Polly.Thi')
                    response.say("Tôi có thể giúp gì thêm cho bạn?", voice='alice', language='vi-VN')
                
                else:
                    #response.say("How can I assist you further?", voice='Polly.Thi')
                    response.say("How can I assist you further?", voice='alice', language='en-US')

                response.record(
                    action=f'{request.url_root.rstrip("/")}/twilio/process-recording/{call_sid}',
                    method='POST',
                    timeout=4, # 4 seconds wait
                    finish_on_key='#'
                )

            # User say something else
            else:
                # Ask user to repeat final confirmation
                conversation_manager.update_conversation(call_sid, transcript, ai_response, 'confirmation')
                #response.say(ai_response, voice='Polly.Thi')
                current_language = conversation_manager.get_language(call_sid)
                if current_language == 'vi':
                    response.say(ai_response, voice='alice', language='vi-VN')
                else:
                    response.say(ai_response, voice='alice', language='en-US')

                response.record(
                    action=f'{request.url_root.rstrip("/")}/twilio/process-confirmation/{call_sid}',
                    method='POST',
                    timeout=4, # 4 seconds wait
                    finish_on_key='#'
                )

        # Confirm what users say
        else:
            # Users say "yes"
            if users_say_yes(transcript.lower()):
                # Ask if that's all they need
                conversation_manager.update_conversation(call_sid, transcript, ai_response, 'confirmation')
                #response.say(ai_response, voice='Polly.Thi')
                current_language = conversation_manager.get_language(call_sid)
                if current_language == 'vi':
                    response.say(ai_response, voice='alice', language='vi-VN')
                else:
                    response.say(ai_response, voice='alice', language='en-US')

                response.record(
                    action=f'{request.url_root.rstrip("/")}/twilio/process-confirmation/{call_sid}',
                    method='POST',
                    timeout=4, # 4 seconds wait
                    finish_on_key='#'
                )

            # Users say "no"
            elif users_say_no(transcript.lower()):
                # Ask user to repeat - go back to greeting
                conversation_manager.update_conversation(call_sid, transcript, ai_response, 'greeting')
                #response.say(ai_response, voice='Polly.Thi')
                current_language = conversation_manager.get_language(call_sid)
                if current_language == 'vi':
                    response.say(ai_response, voice='alice', language='vi-VN')
                else:
                    response.say(ai_response, voice='alice', language='en-US')

                response.record(
                    action=f'{request.url_root.rstrip("/")}/twilio/process-recording/{call_sid}',
                    method='POST',
                    timeout=4, # 4 seconds wait
                    finish_on_key='#'
                )

            # Users say something else
            else:
                # Ask user to repeat
                conversation_manager.update_conversation(call_sid, transcript, ai_response, 'confirmation')
                #response.say(ai_response, voice='Polly.Thi')
                current_language = conversation_manager.get_language(call_sid)
                if current_language == 'vi':
                    response.say(ai_response, voice='alice', language='vi-VN')
                else:
                    response.say(ai_response, voice='alice', language='en-US')

                response.record(
                    action=f'{request.url_root.rstrip("/")}/twilio/process-confirmation/{call_sid}',
                    method='POST',
                    timeout=4, # 4 seconds wait
                    finish_on_key='#'
                )
    
    return str(response)

@call_bp.route('/process-confirmation/<call_sid>', methods=['GET', 'POST'])
def process_confirmation(call_sid):
    return process_recording(call_sid)

def users_say_yes(transcript):
    arr = ['yes', 'correct', 'right', 'yeah', 'yep', 'uh-huh', 'ok', 'okay', 'có', 'đúng', 'phải', 'ừ', 'vâng', 'dạ', 'đồng ý', 'chính xác']
    return any(word in transcript.lower() for word in arr)

def users_say_no(transcript):
    arr = ['no', 'wrong', 'incorrect', 'nope', 'nah', 'không', 'sai', 'không phải', 'không đúng']
    return any(word in transcript.lower() for word in arr)