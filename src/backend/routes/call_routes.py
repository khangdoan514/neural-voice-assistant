from ..utils.conversation_manager import ConversationManager
from ..utils.file_handler import save_conversation
from ..services.openai_service import generate_response, transcribe_audio
from flask import Blueprint, request, Response
from twilio.twiml.voice_response import VoiceResponse
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

    # Get the current base URL dynamically
    base_url = request.url_root.rstrip('/')

    print(f"Incoming call received: {call_sid}\n")

    if not call_sid:
        print("ERROR: No CallSid received from Twilio.")
        response.say("System error. Please try again later.", voice='alice')
        return str(response)

    # Start new conversation
    conversation_manager.start_conversation(call_sid)

    # Current conversation state
    state = conversation_manager.get_conversation_state(call_sid)
    
    # Initial greeting
    response.say("Hi, I'm an AI assistant. What do you need help with today?", voice='alice', language='en-US')
    print("AI response: Hi, I'm an AI assistant. What do you need help with today?")
    print(f"Current conversation state: {state}\n")
    
    # Record user's response
    response.record(
        action=f'{base_url}/twilio/process-recording/{call_sid}',
        method='POST',
        max_length=5, # 5 seconds wait
        finish_on_key='#',
        play_beep=True,
        transcribe=False
    )
    
    # If no recording, say goodbye
    if not response:
        response.say("I didn't hear anything. Goodbye!", voice='alice')
        print("I didn't hear anything. Goodbye!")
        print(f"Current conversation state: {state}\n")

    return str(response)

@call_bp.route('/process-recording/<call_sid>', methods=['GET', 'POST'])
def process_recording(call_sid):
    # Process the recording after user speaks
    response = VoiceResponse()
    
    # Extract RecordingUrl based on request method
    if request.method == 'POST':
        recording_url = request.form.get('RecordingUrl')
    
    else:
        recording_url = request.args.get('RecordingUrl')
        
    if recording_url:        
        # Use transcription
        transcript = transcribe_audio(recording_url)
        print(f"User response: '{transcript}'")

        # Current conversation state
        state = conversation_manager.get_conversation_state(call_sid)
        print(f"Current conversation state: {state}\n")
        
        # Generate AI response based on state
        ai_response = generate_response(transcript, state)
        print(f"AI response: '{ai_response}'")
        
        if state == 'greeting':
            # Confirm user response
            conversation_manager.set_user_request(call_sid, transcript)
            conversation_manager.update_conversation(call_sid, transcript, ai_response, 'confirmation')
            
            response.say(ai_response, voice='alice')
            response.record(
                action=f'{request.url_root.rstrip("/")}/twilio/process-confirmation/{call_sid}',
                method='POST',
                max_length=5, # 5 seconds wait
                finish_on_key='#'
            )
            
        elif state == 'confirmation':
            # Process confirmation response
            if any(word in transcript.lower() for word in ['yes', 'correct', 'right', 'yeah', 'yep', 'uh-huh', 'ok', 'okay']):
                # Save conversation and end call
                user_request = conversation_manager.get_user_request(call_sid)
                conversation_history = conversation_manager.get_conversation_history(call_sid)
                
                save_conversation(call_sid, user_request, conversation_history)
                response.say(ai_response, voice='alice')
                conversation_manager.end_conversation(call_sid)
                
            elif any(word in transcript.lower() for word in ['no', 'wrong', 'incorrect', 'nope', 'nah']):
                # Ask user to repeat - go back to greeting
                conversation_manager.update_conversation(call_sid, transcript, ai_response, 'greeting')
                response.say(ai_response, voice='alice')
                response.record(
                    action=f'{request.url_root.rstrip("/")}/twilio/process-recording/{call_sid}',
                    method='POST',
                    max_length=5, # 5 seconds wait
                    finish_on_key='#'
                )

            else:
                # Ask user to repeat
                conversation_manager.update_conversation(call_sid, transcript, ai_response, 'confirmation')
                response.say(ai_response, voice='alice')
                response.record(
                    action=f'{request.url_root.rstrip("/")}/twilio/process-confirmation/{call_sid}',
                    method='POST',
                    max_length=5, # 5 seconds wait
                    finish_on_key='#'
                )
    
    else:
        print("ERROR: No RecordingUrl found in request.")
        response.say("Sorry, I didn't get that. Please call back again.", voice='alice')
        print("Sorry, I didn't get that. Please call back again.")
        print(f"Current conversation state: {state}\n")
    
    return str(response)

@call_bp.route('/process-confirmation/<call_sid>', methods=['GET', 'POST'])
def process_confirmation(call_sid):
    # Handle the confirmation response (yes/no)
    return process_recording(call_sid)