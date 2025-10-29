from flask import request # type: ignore
from twilio.twiml.voice_response import VoiceResponse # type: ignore
from backend.services.openai_service import transcribe
from backend.utils.conversation_manager import ConversationManager
from backend.utils.file_handler import save_conversation
from backend.routes.handlers.audio_handlers import generate_audio
from backend.routes.handlers.recording_utils import user_info_recording

# Use the existing conversation
conversation = ConversationManager()

def handle_user_info(call_sid):
    # User's name and location
    response = VoiceResponse()
    recording_url = request.form.get('RecordingUrl') or request.args.get('RecordingUrl')

    if not recording_url:
        print("ERROR: No RecordingUrl found in process_user_info()")
        return str(response)

    # Current language and conversation state
    language = conversation.get_language(call_sid)
    state = conversation.get_state(call_sid)
    
    # Use transcription
    transcript = transcribe(recording_url, language)
    print(f"User response: '{transcript}'")

    return get_state(response, call_sid, language, state, transcript)

def get_state(response, call_sid, language, state, transcript): 
    if state == 'asking_name':
        return get_name(response, call_sid, language, transcript)
    
    elif state == 'asking_location':
        return get_location(response, call_sid, language, transcript)
    
    return response

def get_name(response, call_sid, language, transcript):
    if transcript.strip():
        conversation.set_info(call_sid, 'name', transcript)
        print(f"User response: {transcript}")
        
        # Ask for location
        if language == 'vi':
            generate_audio(response, call_sid, "Cảm ơn. Bạn có thể cho biết địa chỉ của bạn được không?", 'vi')
            print("AI response: Cảm ơn. Bạn có thể cho biết địa chỉ của bạn được không?")
        
        else:
            generate_audio(response, call_sid, "Thank you. Could you please provide your location?", 'en')
            print("AI response: Thank you. Could you please provide your location?")
            
        conversation.update(call_sid, transcript, "Asking for location", 'asking_location')
    
    # Did not get user's name
    else:
        if language == 'vi':
            generate_audio(response, call_sid, "Xin vui lòng cho biết tên của bạn để chúng tôi có thể hỗ trợ bạn.", 'vi')
            print("AI response: Xin vui lòng cho biết tên của bạn để chúng tôi có thể hỗ trợ bạn.")
        
        else:
            generate_audio(response, call_sid, "Please provide your name so we can assist you.", 'en')
            print("AI response: Please provide your name so we can assist you.")
            
        # Continue collecting information
        conversation.update(call_sid, transcript, "Asking for name again", 'asking_name')

    user_info_recording(response, call_sid)
    return str(response)

def get_location(response, call_sid, language, transcript):
    if transcript.strip():
        conversation.set_user_info(call_sid, 'location', transcript)
        print(f"User: {transcript}")
        
        # Save conversation
        user_info = conversation.get_info(call_sid)
        user_request = conversation.get_request(call_sid)
        conversation_history = conversation.get_history(call_sid)
        save_conversation(call_sid, user_info, user_request, conversation_history)

        # Goodbye
        if language == 'vi':
            generate_audio(response, call_sid, "Cảm ơn, yêu cầu của bạn đã được gửi đầy đủ. Chúng tôi sẽ hỗ trợ bạn sớm nhất có thể. Tạm biệt!", 'vi')
            print("AI: Cảm ơn, yêu cầu của bạn đã được gửi đầy đủ. Chúng tôi sẽ hỗ trợ bạn sớm nhất có thể. Tạm biệt!")
        
        else:
            generate_audio(response, call_sid, "Thank you, your request has been submitted with all your information. We'll make sure to help you as quickly as possible. Goodbye!", 'en')
            print("AI: Thank you, your request has been submitted with all your information. We'll make sure to help you as quickly as possible. Goodbye!")
        
        conversation.end(call_sid)
        return str(response)

    # Did not get user's location
    else:
        if language == 'vi':
            generate_audio(response, call_sid, "Xin vui lòng cho biết địa chỉ của bạn để chúng tôi có thể cử nhân viên đến hỗ trợ.", 'vi')
            print("AI: Xin vui lòng cho biết địa chỉ của bạn để chúng tôi có thể cử nhân viên đến hỗ trợ.")
        
        else:
            generate_audio(response, call_sid, "Please provide your location so we can send someone to assist you.", 'en')
            print("AI: Please provide your location so we can send someone to assist you.")
        
        # Continue collecting information
        conversation.update(call_sid, transcript, "Asking for location again", 'asking_location')
    
    user_info_recording(response, call_sid)
    return str(response)