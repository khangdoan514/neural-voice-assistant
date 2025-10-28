from flask import request, send_file # type: ignore
from twilio.twiml.voice_response import VoiceResponse # type: ignore
from ..services.openai_service import generate_speech # type: ignore
import os
import uuid

def serve_audio(call_sid, filename):
    # Serve generated audio files to Twilio
    audio_path = f"/tmp/{call_sid}_{filename}"
    
    if os.path.exists(audio_path):
        return send_file(audio_path, mimetype='audio/mpeg')
    
    else:
        print(f"ERROR: No audio file found in serve_audio()")
        return "Audio not found", 404
    
def generate_audio_response(response, call_sid, text, language='en'):    
    # Generate speech file
    voice = "nova" if language == 'en' else "shimmer"
    audio_file = generate_speech(text, voice)
    
    if not audio_file:
        # Use Twilio TTS
        if language == 'vi':
            response.say(text, voice='alice', language='vi-VN')
        
        else:
            response.say(text, voice='alice', language='en-US')
        
        return
    
    # Move to permanent location
    final_filename = f"response_{uuid.uuid4().hex[:8]}.mp3"
    final_path = f"/tmp/{call_sid}_{final_filename}"
    os.rename(audio_file, final_path)
    
    # Get base URL
    base_url = request.url_root.rstrip('/')
    audio_url = f"{base_url}/twilio/audio/{call_sid}/{final_filename}"
    
    # Play the audio
    response.play(audio_url)