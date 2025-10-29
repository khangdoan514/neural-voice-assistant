from flask import request # type: ignore
from twilio.twiml.voice_response import VoiceResponse # type: ignore
from ..services.openai_service import transcribe # type: ignore
from ..services.advanced_openai_service import generate_ai_response # type: ignore
from ..utils.conversation_manager import ConversationManager # type: ignore
from ..utils.intent_detector import is_yes, is_no # type: ignore
from .audio_handlers import generate_audio
from .recording_utils import recording_processing, confirmation_recording, user_info_recording

# Use the existing conversation
conversation = ConversationManager()

# Process the recording after user speaks
def handle_record(call_sid):
    response = VoiceResponse()
    recording_url = request.form.get('RecordingUrl') or request.args.get('RecordingUrl')

    if not recording_url:
        print("ERROR: No RecordingUrl found in process_recording()")
        generate_audio(response, call_sid, "Sorry, I didn't get that. Please try again.", 'en')
        return str(response)

    # Get language preference
    language = conversation.get_language(call_sid)
    transcript = transcribe(recording_url, language)
    print(f"User: '{transcript}'")

    # Current conversation state
    state = conversation.get_state(call_sid)
    print(f"Conversation state: {state}\n")

    # Vietnamese flow 
    if language == 'vi':
        return vietnamese_flow(response, call_sid, transcript)
    
    # English flow
    else:
        return english_flow(response, call_sid, transcript, state)
    
# Process confirmation responses
def handle_confirm(call_sid):
    return handle_record(call_sid)

# Vietnamese flow
def vietnamese_flow(response, call_sid, transcript):
    # Get user's info
    user_info = conversation.get_info(call_sid)
    conversation.set_request(call_sid, transcript)
    
    # Ask for name
    if user_info.get('name') is None:
        generate_audio(response, call_sid, "Để chúng tôi hỗ trợ tốt hơn, xin vui lòng cho biết tên của bạn?", 'vi')
        conversation.update(call_sid, transcript, "Đang hỏi tên", 'asking_name')

    # Ask for location
    elif user_info.get('location') is None:
        generate_audio(response, call_sid, "Cảm ơn. Bạn có thể cho biết địa chỉ của bạn được không?", 'vi')
        conversation.update(call_sid, transcript, "Đang hỏi địa chỉ", 'asking_location')

    # Recording utils
    user_info_recording(response, call_sid)
    return str(response)

# English flow
def english_flow(response, call_sid, transcript, state):
    # Conversation history
    conversation_history = conversation.get_conversation_history(call_sid)
    
    if state == 'greeting':
        return greeting_state(response, call_sid, transcript, conversation_history)
        
    elif state == 'confirmation':
        return confirmation_state(response, call_sid, transcript, conversation_history)
    
# Greeting state in English flow
def greeting_state(response, call_sid, transcript, conversation_history):
    # AI response
    ai_response = generate_audio(transcript, 'greeting', conversation_history, 'en')
    
    # Confirm user response
    conversation.set_request(call_sid, transcript)
    conversation.update(call_sid, transcript, ai_response, 'confirmation')
    
    generate_audio(response, call_sid, ai_response, 'en')

    # Recording utils
    confirmation_recording(response, call_sid)
    return str(response)

# Confirmation state in English flow
def confirmation_state(response, call_sid, transcript, conversation_history):
    ai_response = conversation_history[-1]['ai'] if conversation_history else ""
    print(f"AI response: '{ai_response}'")
    
    confirmation = [
        "Is that all you need help with?",
        "Okay, is that all you need help with?",
        "Có phải đó là tất cả những gì bạn cần giúp không?",
        "Được rồi, có phải đó là tất cả những gì bạn cần giúp không?"
    ]

    # Final confirmation
    if any(phrase in ai_response for phrase in confirmation):
        return final_confirmation(response, call_sid, transcript, conversation_history)

    # Confirm what users say
    else:
        return standard_confirmation(response, call_sid, transcript, conversation_history)

# Final confirmation in English flow
def final_confirmation(response, call_sid, transcript, conversation_history):
    # Users say "yes"
    if is_yes(transcript.lower()):
        return user_info_collection(response, call_sid, transcript)
    
    # User say "no"
    elif is_no(transcript.lower()):
        # Follow-up
        conversation.update(call_sid, transcript, "How can I assist you further?", 'greeting')
        generate_audio(response, call_sid, "How can I assist you further?", 'en')
        
        # Recording utils
        recording_processing(response, call_sid)

    # User say something else
    else:
        # Ask user to repeat final confirmation
        ai_response = generate_ai_response(transcript, 'confirmation', conversation_history, 'en')
        conversation.update(call_sid, transcript, ai_response, 'confirmation')
        generate_audio(response, call_sid, ai_response, 'en')

        # Recording utils
        confirmation_recording(response, call_sid)

    return str(response)

def standard_confirmation(response, call_sid, transcript, conversation_history):
    # Standard confirmation in English flow
    ai_response = generate_ai_response(transcript, 'confirmation', conversation_history, 'en')
    print(f"AI response: '{ai_response}'")

    # Users say "yes"
    if is_yes(transcript.lower()):
        # Ask if that's all they need
        conversation.update(call_sid, transcript, ai_response, 'confirmation')
        generate_audio(response, call_sid, ai_response, 'en')

        # Recording utils
        confirmation_recording(response, call_sid)

    # Users say "no"
    elif is_no(transcript.lower()):
        # Ask user to repeat - go back to greeting
        conversation.update(call_sid, transcript, ai_response, 'greeting')
        generate_audio(response, call_sid, ai_response, 'en')

        # Recording utils
        recording_processing(response, call_sid)

    # Users say something else
    else:
        # Ask user to repeat
        conversation.update(call_sid, transcript, ai_response, 'confirmation')
        generate_audio(response, call_sid, ai_response, 'en')

        # Recording utils
        confirmation_recording(response, call_sid)
    
    return str(response)

def user_info_collection(response, call_sid, transcript):
    # Get user's info
    user_info = conversation.get_user_info(call_sid)

    if user_info.get('name') is None:
        # Ask for name
        generate_audio(response, call_sid, "To better assist you, could you please tell me your name?", 'en')
        conversation.update(call_sid, transcript, "Asking for name", 'asking_name')
        
        # Recording utils
        user_info_recording(response, call_sid)
    
    elif user_info.get('location') is None:
        # Ask for location
        generate_audio(response, call_sid, "Thank you. Could you please provide your address?", 'en')
        conversation.update(call_sid, transcript, "Asking for location", 'asking_location')
        
        # Recording utils
        user_info_recording(response, call_sid)
    
    return str(response)