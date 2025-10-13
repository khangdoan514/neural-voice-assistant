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
        print(f"Downloading audio from: {audio_url}")
        
        # Twilio recordings are in .wav format
        response = requests.get(audio_url, auth=(Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN))
        
        if response.status_code == 200:
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
                temp_audio.write(response.content)
                print(f"Audio downloaded to: {temp_audio.name}")
                return temp_audio.name
        
        else:
            print(f"Failed to download audio: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Error downloading audio: {e}")
        return None

def transcribe_audio_real(audio_url):
    # Real transcription using OpenAI Whisper API
    try:
        print(f"Transcribing audio from: {audio_url}")
        
        # Download the audio file
        audio_file_path = download_audio(audio_url)
        
        if not audio_file_path:
            print("Could not download audio file")
            return "I couldn't process the audio. Please try again."
        
        # Transcribe with OpenAI Whisper
        with open(audio_file_path, 'rb') as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language='en'
            )
        
        transcription_text = transcript.text.strip()
        print(f"Transcription result: '{transcription_text}'")
        
        # Clean up temporary file
        os.unlink(audio_file_path)
        
        if not transcription_text:
            return "I couldn't understand what you said. Please try again."
            
        return transcription_text
    
    except Exception as e:
        print(f"Transcription error: {e}")
        return "I encountered an error. Please repeat what you said."

def generate_conversation_response(user_input, state):
    # Used by the call_routes.py
    print(f"Generating response for state: {state}")

    if state == 'greeting':
        if not user_input or len(user_input.strip()) < 2:
            return "I didn't quite catch that. What do you need help with?"
        
        return f"I heard: '{user_input}'. Is this correct?"
    
    elif state == 'confirmation':
        if any(word in user_input.lower() for word in ['yes', 'correct', 'right', 'yeah', 'yep']):
            return "Thank you! Your request has been recorded. Goodbye!"
        
        elif any(word in user_input.lower() for word in ['no', 'wrong', 'incorrect', 'nope']):
            return "Please repeat what you need help with."
        
        else:
            return "Please say yes if that's correct, or no to repeat."
    
    else:
        return "How can I help you today?"

def test_openai_setup():
    # Test if OpenAI is configured correctly
    try:
        if not Config.OPENAI_API_KEY:
            print("OpenAI API key is not set")
            return False
        
        # Test with a simple API call (v1.0.0+ syntax)
        client.models.list()
        print("OpenAI API key is valid")
        return True
        
    except Exception as e:
        print(f"Error testing OpenAI setup: {e}")
        return False