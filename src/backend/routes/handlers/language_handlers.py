from flask import request # type: ignore
from twilio.twiml.voice_response import VoiceResponse # type: ignore
from ..services.twilio_service import validate_twilio_signature # type: ignore
from ..services.openai_service import transcribe_audio # type: ignore
from ..utils.conversation_manager import ConversationManager # type: ignore
from .audio_handlers import generate_audio_response
from .recording_utils import add_recording_processing

# Use the existing conversation
conversation_manager = ConversationManager()

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
    add_recording_processing(response, call_sid)
    
    return str(response)