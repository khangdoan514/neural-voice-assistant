from backend.utils.conversation_manager import ConversationManager
from backend.utils.file_handler import save_conversation
from backend.services.openai_service import simple_ai_response
from flask import Blueprint, request, Response
from twilio.twiml.voice_response import VoiceResponse
import requests
import os

# Create blueprint
call_bp = Blueprint('call_routes', __name__)

# Initialize conversation manager
conversation_manager = ConversationManager()

@call_bp.route('/voice', methods=['POST'])
def handle_incoming_call():
    # Handle incoming call to Twilio number
    response = VoiceResponse()
    call_sid = request.form.get('CallSid')

    print(f"Incoming call received: {call_sid}")

    # Start new conversation
    conversation_manager.start_conversation(call_sid)
    
    # Initial greeting
    response.say("Hi, I'm an AI assistant. What do you need help with today?", voice='alice', language='en-US')
    
    # Record user's response
    response.record(
        action=f'/twilio/process-recording/{call_sid}',
        method='POST',
        max_length=10, # 10 seconds max
        finish_on_key='#',
        play_beep=True
    )
    
    # If no recording, say goodbye
    response.say("I didn't hear anything. Goodbye!", voice='alice')
    
    print(f"Sent greeting and started recording for: {call_sid}")
    return str(response)

@call_bp.route('/process-recording/<call_sid>', methods=['POST'])
def process_recording(call_sid):
    # Process the recording after user speaks
    response = VoiceResponse()
    recording_url = request.form.get('RecordingUrl')
    
    print(f"Processing recording for {call_sid}: {recording_url}")
    
    if recording_url:
        transcript = "I need help with my account"  # Mock response
        
        current_state = conversation_manager.get_conversation_state(call_sid)
        print(f"Current conversation state: {current_state}")
        
        # Generate AI response based on state
        ai_response = simple_ai_response(transcript, current_state)
        
        if current_state == 'greeting':
            # Confirm what user said
            conversation_manager.update_conversation(call_sid, transcript, ai_response, 'confirmation')
            conversation_manager.set_user_request(call_sid, transcript)
            
            response.say(ai_response, voice='alice')
            response.record(
                action=f'/twilio/process-confirmation/{call_sid}',
                method='POST',
                max_length=5, # Shorter for yes/no
                finish_on_key='#'
            )
            
        elif current_state == 'confirmation':
            # Process confirmation response
            if 'yes' in transcript.lower():
                # Save conversation and end call
                user_request = conversation_manager.get_user_request(call_sid)
                conversation_history = conversation_manager.get_conversation_history(call_sid)
                
                save_conversation(call_sid, user_request, conversation_history)
                response.say(ai_response, voice='alice')
                conversation_manager.end_conversation(call_sid)
                
            else:
                # Ask user to repeat
                conversation_manager.update_conversation(call_sid, transcript, ai_response, 'greeting')
                response.say(ai_response, voice='alice')
                response.record(
                    action=f'/twilio/process-recording/{call_sid}',
                    method='POST',
                    max_length=10,
                    finish_on_key='#'
                )
    
    else:
        response.say("Sorry, I didn't get that. Please call back again.", voice='alice')
    
    return str(response)

@call_bp.route('/process-confirmation/<call_sid>', methods=['POST'])
def process_confirmation(call_sid):
    # Handle the confirmation response (yes/no)
    print(f"Processing confirmation for: {call_sid}")
    return process_recording(call_sid) # Reuse the same logic