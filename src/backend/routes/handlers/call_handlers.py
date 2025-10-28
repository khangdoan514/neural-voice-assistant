from ..utils.conversation_manager import ConversationManager # type: ignore
from ..services.twilio_service import validate_twilio_signature # type: ignore
from .audio_handlers import generate_audio_response
from .recording_utils import add_language_choice_recording
from flask import request # type: ignore
from twilio.twiml.voice_response import VoiceResponse # type: ignore

# Initialize conversation manager
conversation_manager = ConversationManager()

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
    add_language_choice_recording(response, call_sid)

    return str(response)