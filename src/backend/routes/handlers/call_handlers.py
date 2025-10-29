from flask import request # type: ignore
from twilio.twiml.voice_response import VoiceResponse # type: ignore
from backend.utils.conversation_manager import ConversationManager # type: ignore
from backend.services.twilio_service import validate_twilio # type: ignore
from backend.routes.handlers.audio_handlers import generate_audio
from backend.routes.handlers.recording_utils import language_choice_recording

# Initialize conversation manager
conversation = ConversationManager()

def handle_call():
    # Validate Twilio
    if not validate_twilio(request):
        return "Invalid signature", 403

    # Handle incoming call to Twilio number
    response = VoiceResponse()
    call_sid = request.form.get('CallSid')
    phone = request.form.get('Caller')

    print(f"Incoming call received: {call_sid}\n")
    print(f"User phone number: {phone}")

    if not call_sid:
        print("ERROR: No CallSid received in handle_incoming_call()")
        response.say("System error. Please try again later.", voice='alice')
        return str(response)

    # New conversation
    conversation.start(call_sid, phone)

    # Current conversation state
    state = conversation.get_state(call_sid)
    
    # Initial greeting
    generate_audio(response, call_sid, "Hi, I'm Salli, an artificial intelligence assistant. Would you prefer English or Vietnamese?", 'en')
    print("AI: Hi, I'm Salli, an artificial intelligence assistant. Would you prefer English or Vietnamese?")
    print(f"Conversation state: {state}\n")
    
    # User's response
    language_choice_recording(response, call_sid)

    return str(response)