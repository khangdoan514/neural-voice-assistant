from openai import OpenAI
from config import Config
import os
import requests
import tempfile

# Initialize OpenAI
client = OpenAI(api_key=Config.OPENAI_API_KEY)

def download_audio(audio_url):
    # Download audio file from Twilio recording URL
    try:        
        # Twilio recordings are in .wav format
        response = requests.get(audio_url, auth=(Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN))
        
        if response.status_code == 200:
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
                temp_audio.write(response.content)
                return temp_audio.name
        
        else:
            print(f"ERROR: Failed to download audio: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"ERROR: Failed to download audio.")
        return None

def transcribe_audio(audio_url, language='en'):
    # OpenAI Whisper API
    try:        
        # Download the audio file
        audio_path = download_audio(audio_url)
        
        if not audio_path:
            print("ERROR: Could not download audio file.")
            return "I couldn't process the audio. Please try again."
        
        transcript_language = 'en'  # default
        if language == 'vi':
            transcript_language = 'vi'

        # Transcribe
        with open(audio_path, 'rb') as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language=transcript_language
            )
        
        transcription_text = transcript.text.strip()
        
        # Delete temporary file
        os.unlink(audio_path)
        
        if not transcription_text:
            if language == 'vi':
                return "Tôi không nghe rõ bạn nói gì. Hãy thử lại nhé."
            
            else:
                return "I couldn't understand what you said. Please try again."
            
        return transcription_text
    
    except Exception as e:
        print(f"ERROR: Failed transcription.")
        if language == 'vi':
            return "Có lỗi xảy ra. Hãy lặp lại những gì bạn đã nói."
        
        else:
            return "I encountered an error. Please repeat what you said."

# Used by the call_routes.py
def generate_response(user_input, state):
    if state == 'greeting':
        if not user_input or len(user_input.strip()) < 2:
            return "I didn't quite catch that. What do you need help with?"
        
        return f"I heard: '{user_input}'. Is this correct?"
    
    elif state == 'confirmation':
        if any(word in user_input.lower() for word in ['yes', 'correct', 'right', 'yeah', 'yep', 'uh-huh', 'ok', 'okay']):
            return "Thank you! Your request has been recorded. Goodbye!"
        
        elif any(word in user_input.lower() for word in ['no', 'wrong', 'incorrect', 'nope', 'nah']):
            return "Please repeat what you need help with."
        
        else:
            return "Please say yes if that's correct, or no if you'd like me to ask again."
    
    else:
        return "How can I help you today?"