from ..services.twilio_service import validate_twilio_signature # type: ignore
from ..services.openai_service import transcribe_audio # type: ignore
from ..services.advanced_openai_service import generate_advanced_response # type: ignore
from ..utils.conversation_manager import ConversationManager # type: ignore
from ..utils.intent_detector import users_say_yes, users_say_no # type: ignore
from .audio_handlers import generate_audio_response
from config import Config
from flask import request # type: ignore
from twilio.twiml.voice_response import VoiceResponse # type: ignore

# Use the existing conversation
conversation_manager = ConversationManager()

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
    
def process_confirmation(call_sid):
    return process_recording(call_sid)

def vietnamese_flow(response, call_sid, transcript):
    pass

def english_flow(response, call_sid, transcript, state):
    pass

def greeting_state(response, call_sid, transcript, conversation_history):
    pass

def confirmation_state(response, call_sid, transcript, conversation_history):
    pass

def final_confirmation(response, call_sid, transcript, conversation_history):
    pass

def standard_confirmation(response, call_sid, transcript, conversation_history):
    pass

def user_info_collection(response, call_sid, transcript):
    pass

def recording_instruction(response, call_sid):
    response.record(
        action=f'{request.url_root.rstrip("/")}/twilio/process-user-info/{call_sid}',
        method='POST',
        timeout=Config.RECORDING_TIMEOUT,
        finish_on_key='#',
        play_beep=False,
        transcribe=False
    )