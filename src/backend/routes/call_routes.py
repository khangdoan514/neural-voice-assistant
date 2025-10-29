from .handlers.audio_handlers import serve_audio
from .handlers.call_handlers import handle_call
from .handlers.language_handlers import handle_lang
from .handlers.user_info_handlers import handle_user_info
from .handlers.recording_handlers import handle_record, handle_confirm
from flask import Blueprint # type: ignore

# Create blueprint
call_bp = Blueprint('call_routes', __name__)

# Register routes
call_bp.route('/audio/<call_sid>/<filename>')(serve_audio)
call_bp.route('/voice', methods=['POST'])(handle_call)
call_bp.route('/process-language-choice/<call_sid>', methods=['GET', 'POST'])(handle_lang)
call_bp.route('/process-user-info/<call_sid>', methods=['GET', 'POST'])(handle_user_info)
call_bp.route('/process-recording/<call_sid>', methods=['GET', 'POST'])(handle_record)
call_bp.route('/process-confirmation/<call_sid>', methods=['GET', 'POST'])(handle_confirm)