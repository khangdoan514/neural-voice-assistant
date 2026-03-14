from flask import Blueprint, jsonify, send_file
import os
from pathlib import Path

conversation_bp = Blueprint('conversation', __name__)

CONVERSATIONS_PATH = Path(__file__).parent.parent.parent / 'conversations'

@conversation_bp.route('/api/conversations', methods=['GET'])
def get_conversations():
    """Get list of all conversation files"""
    try:
        if not CONVERSATIONS_PATH.exists():
            return jsonify({'error': 'Conversations folder not found'}), 404
            
        files = []
        for file_path in CONVERSATIONS_PATH.iterdir():
            if file_path.is_file() and file_path.suffix == '.txt':
                stat = file_path.stat()
                files.append({
                    'name': file_path.name,
                    'path': file_path.name,
                    'modified': stat.st_mtime,
                    'size': stat.st_size
                })
        
        # Sort by modified date, newest first
        files.sort(key=lambda x: x['modified'], reverse=True)
        
        return jsonify(files), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@conversation_bp.route('/api/conversations/<filename>', methods=['GET'])
def get_conversation_content(filename):
    """Get content of a specific conversation file"""
    try:
        # Security: prevent directory traversal attacks
        if '..' in filename or '/' in filename or '\\' in filename:
            return jsonify({'error': 'Invalid filename'}), 400
            
        file_path = CONVERSATIONS_PATH / filename
        
        if not file_path.exists():
            return jsonify({'error': 'File not found'}), 404
            
        if not file_path.is_file() or file_path.suffix != '.txt':
            return jsonify({'error': 'Invalid file type'}), 400
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        return jsonify({
            'content': content,
            'filename': filename
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Optional: Add endpoint to download files
@conversation_bp.route('/api/conversations/<filename>/download', methods=['GET'])
def download_conversation(filename):
    """Download a conversation file"""
    try:
        # Security: prevent directory traversal attacks
        if '..' in filename or '/' in filename or '\\' in filename:
            return jsonify({'error': 'Invalid filename'}), 400
            
        file_path = CONVERSATIONS_PATH / filename
        
        if not file_path.exists():
            return jsonify({'error': 'File not found'}), 404
            
        if not file_path.is_file() or file_path.suffix != '.txt':
            return jsonify({'error': 'Invalid file type'}), 400
            
        return send_file(
            file_path,
            as_attachment=True,
            download_name=filename,
            mimetype='text/plain'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500