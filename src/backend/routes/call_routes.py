from ..utils.conversation_manager import ConversationManager
from ..utils.file_handler import save_conversation
from ..services.openai_service import transcribe_audio
from ..services.advanced_openai_service import generate_advanced_response
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
        response.say(f'<speak>{"System error. Please try again later."}</speak>', voice='alice')
        return str(response)

    # Start new conversation
    conversation_manager.start_conversation(call_sid)

    # Current conversation state
    state = conversation_manager.get_conversation_state(call_sid)
    
    # Initial greeting
    response.say(f'<speak>{"Hi, I'm Alice, an artificial intelligence assistant. What do you need help with today?"}</speak>', voice='alice')
    print("AI response: Hi, I'm Alice, an artificial intelligence assistant. What do you need help with today?")
    print(f"Current conversation state: {state}\n")
    
    # Record user's response
    response.record(
        action=f'{base_url}/twilio/process-recording/{call_sid}',
        method='POST',
        timeout=5, # 5 seconds wait
        finish_on_key='#',
        play_beep=True,
        transcribe=False
    )
    
    # If no recording, say goodbye
    if not response:
        response.say(f'<speak>{"I didn't hear anything. Goodbye!"}</speak>', voice='alice')
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

    if not recording_url:
        print("ERROR: No RecordingUrl found in request.")
        response.say(f'<speak>{"Sorry, I didn't get that. Please try again."}</speak>', voice='alice')
        return str(response)

    # Use transcription
    transcript = transcribe_audio(recording_url)
    print(f"User response: '{transcript}'")

    # Current conversation state
    state = conversation_manager.get_conversation_state(call_sid)
    print(f"Conversation state: {state}\n")

    # Conversation history for context
    conversation_history = conversation_manager.get_conversation_history(call_sid)
    
    # Generate AI response based on state
    ai_response = generate_advanced_response(transcript, state, conversation_history)
    
    if state == 'greeting':
        # Confirm user response
        conversation_manager.set_user_request(call_sid, transcript)
        conversation_manager.update_conversation(call_sid, transcript, ai_response, 'confirmation')
        
        response.say(f'<speak>{ai_response}</speak>', voice='alice')
        response.record(
            action=f'{request.url_root.rstrip("/")}/twilio/process-confirmation/{call_sid}',
            method='POST',
            timeout=5, # 5 seconds wait
            finish_on_key='#'
        )
        
    elif state == 'confirmation':
        # Check if this is the final confirmation ("Is that all you need help with?")
        ai_confirmation_response = conversation_history[-1]['ai'] if conversation_history else ""

        if "Is that all you need help with?" in ai_confirmation_response:
            # Process confirmation response
            if any(word in transcript.lower() for word in ['yes', 'correct', 'right', 'yeah', 'yep', 'uh-huh', 'ok', 'okay']):
                # Save conversation and end call
                user_request = conversation_manager.get_user_request(call_sid)
                
                save_conversation(call_sid, user_request, conversation_history)
                response.say(f'<speak>{"Thank you! Your request has been recorded. Goodbye!"}</speak>', voice='alice')
                print("AI response: Thank you! Your request has been recorded. Goodbye!")
                conversation_manager.end_conversation(call_sid)
                
            elif any(word in transcript.lower() for word in ['no', 'wrong', 'incorrect', 'nope', 'nah']):
                # Ask user what else they need help with
                conversation_manager.update_conversation(call_sid, transcript, ai_response, 'greeting')
                response.say(f'<speak>{"How can I assist you further?"}</speak>', voice='alice')
                response.record(
                    action=f'{request.url_root.rstrip("/")}/twilio/process-recording/{call_sid}',
                    method='POST',
                    timeout=5, # 5 seconds wait
                    finish_on_key='#'
                )

            else:
                # Ask user to repeat final confirmation
                conversation_manager.update_conversation(call_sid, transcript, ai_response, 'confirmation')
                response.say(f'<speak>{ai_response}</speak>', voice='alice')
                response.record(
                    action=f'{request.url_root.rstrip("/")}/twilio/process-confirmation/{call_sid}',
                    method='POST',
                    timeout=5, # 5 seconds wait
                    finish_on_key='#'
                )

        else:
            # Regular confirmation flow (first confirmation)
            if any(word in transcript.lower() for word in ['yes', 'correct', 'right', 'yeah', 'yep', 'uh-huh', 'ok', 'okay']):
                # Ask if that's all they need
                conversation_manager.update_conversation(call_sid, transcript, ai_response, 'confirmation')
                response.say(f'<speak>{ai_response}</speak>', voice='alice')
                response.record(
                    action=f'{request.url_root.rstrip("/")}/twilio/process-confirmation/{call_sid}',
                    method='POST',
                    timeout=5, # 5 seconds wait
                    finish_on_key='#'
                )

            elif any(word in transcript.lower() for word in ['no', 'wrong', 'incorrect', 'nope', 'nah']):
                # Ask user to repeat - go back to greeting
                conversation_manager.update_conversation(call_sid, transcript, ai_response, 'greeting')
                response.say(f'<speak>{ai_response}</speak>', voice='alice')
                response.record(
                    action=f'{request.url_root.rstrip("/")}/twilio/process-recording/{call_sid}',
                    method='POST',
                    timeout=5, # 5 seconds wait
                    finish_on_key='#'
                )

            else:
                # Ask user to repeat
                conversation_manager.update_conversation(call_sid, transcript, ai_response, 'confirmation')
                response.say(f'<speak>{ai_response}</speak>', voice='alice')
                response.record(
                    action=f'{request.url_root.rstrip("/")}/twilio/process-confirmation/{call_sid}',
                    method='POST',
                    timeout=5, # 5 seconds wait
                    finish_on_key='#'
                )
    
    return str(response)

@call_bp.route('/process-confirmation/<call_sid>', methods=['GET', 'POST'])
def process_confirmation(call_sid):
    # Handle the confirmation response (yes/no)
    return process_recording(call_sid)