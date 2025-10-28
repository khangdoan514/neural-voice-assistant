from config import Config
from flask import request # type: ignore

# Recording configuration
def get_recording_instruction(action_path, call_sid=None):
    base_url = request.url_root.rstrip('/')
    
    if call_sid:
        action_url = f'{base_url}/twilio/{action_path}/{call_sid}'
    
    else:
        action_url = f'{base_url}/twilio/{action_path}'
    
    return {
        'action': action_url,
        'method': 'POST',
        'timeout': Config.RECORDING_TIMEOUT,
        'finish_on_key': '#',
        'play_beep': False,
        'transcribe': False
    }

# Recording instruction for Twilio
def add_recording_instruction(response, action_path, call_sid=None):
    config = get_recording_instruction(action_path, call_sid)
    response.record(**config)

# User info collection
def add_user_info_recording(response, call_sid):
    add_recording_instruction(response, 'process-user-info', call_sid)

# Language choice
def add_language_choice_recording(response, call_sid):
    add_recording_instruction(response, 'process-language-choice', call_sid)

# General recording processing
def add_recording_processing(response, call_sid):
    add_recording_instruction(response, 'process-recording', call_sid)

# Confirmation processin
def add_confirmation_recording(response, call_sid):
    add_recording_instruction(response, 'process-confirmation', call_sid)