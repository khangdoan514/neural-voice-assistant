from flask import request # type: ignore
from twilio.twiml.voice_response import VoiceResponse # type: ignore
from backend.services.twilio_service import validate_twilio
from backend.services.openai_service import transcribe
from backend.utils.conversation_manager import ConversationManager
from backend.routes.handlers.audio_handlers import generate_audio
from backend.routes.handlers.recording_utils import recording_processing

# Use the existing conversation
conversation = ConversationManager()

def handle_language(call_sid):
    # Validate Twilio
    if not validate_twilio(request):
        return "Invalid signature", 403
    
    # Language preference
    response = VoiceResponse()
    recording_url = request.form.get('RecordingUrl') or request.args.get('RecordingUrl')
    
    if not recording_url:
        print("ERROR: No RecordingUrl in handle_language()")
        generate_audio(response, call_sid, "Sorry, I didn't get that. Please call back again.", 'en')
        return str(response)
    
    # Transcribe the language preference
    transcript = transcribe(recording_url)
    print(f"User: '{transcript}'")
    
    # Determine language preference
    if any(word in transcript.lower() for word in ['vietnamese', 'tiếng việt', 'việt nam', 'việt']):
        language = 'vi'
        greeting = "Xin chào, hôm nay bạn cần giúp gì?"
    
    else:
        # Default to English
        language = 'en' 
        greeting = "Hi, what do you need help with today?"
    
    # Store language preference
    conversation.set_language(call_sid, language)
    conversation.update(call_sid, transcript, greeting, 'greeting')
    
    # Main question
    generate_audio(response, call_sid, greeting, language)
    print(f"AI: {greeting}")
    
    # User's request
    recording_processing(response, call_sid)
    return str(response)