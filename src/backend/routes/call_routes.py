from .handlers.audio_handlers import serve_audio
from .handlers.call_handlers import handle_incoming_call
from .handlers.language_handlers import process_language_choice
from .handlers.user_info_handlers import process_user_info
from .handlers.recording_handlers import process_recording, process_confirmation
from flask import Blueprint # type: ignore

# Create blueprint
call_bp = Blueprint('call_routes', __name__)

# Register routes
call_bp.route('/audio/<call_sid>/<filename>')(serve_audio)
call_bp.route('/voice', methods=['POST'])(handle_incoming_call)
call_bp.route('/process-language-choice/<call_sid>', methods=['GET', 'POST'])(process_language_choice)
call_bp.route('/process-user-info/<call_sid>', methods=['GET', 'POST'])(process_user_info)
call_bp.route('/process-recording/<call_sid>', methods=['GET', 'POST'])(process_recording)
call_bp.route('/process-confirmation/<call_sid>', methods=['GET', 'POST'])(process_confirmation)