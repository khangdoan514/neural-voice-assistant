from config import Config
import openai
import os
import requests
import tempfile

# Set up OpenAI
openai.api_key = Config.OPENAI_API_KEY

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
            transcript = openai.Audio.transcribe(
                model="whisper-1",
                file=audio_file
            )
        
        transcription_text = transcript['text'].strip()
        print(f"Transcription result: '{transcription_text}'")
        
        # Clean up temporary file
        import os
        os.unlink(audio_file_path)
        
        if not transcription_text:
            return "I couldn't understand what you said. Please try again."
            
        return transcription_text
        
    except openai.error.AuthenticationError:
        print("OpenAI authentication failed - check API key")
        return "System error. Please try again later."
    
    except Exception as e:
        print(f"Transcription error: {e}")
        return "I encountered an error. Please repeat what you said."

def transcribe_audio(audio_url):
    # Simple transcription function - mock response
    print(f"Would transcribe audio from: {audio_url}")
    
    # Test call flow, For now, mock transcript
    mock_transcripts = [
        "I need help with my account",
        "I want to reset my password", 
        "Can you help me with billing issues",
        "I have a technical problem with your service",
        "I need to update my contact information"
    ]
    
    import random
    mock_transcript = random.choice(mock_transcripts)
    print(f"Mock transcript: {mock_transcript}")
    
    return mock_transcript

def generate_ai_response(transcript, conversation_state):
    # Generate AI response based on conversation state
    print(f"Generating AI response for state: {conversation_state}")
    print(f"User said: {transcript}")
    
    if conversation_state == 'greeting':
        return f"I heard you say: '{transcript}'. Is this correct? Please say yes or no."
    
    elif conversation_state == 'confirmation':
        if 'yes' in transcript.lower():
            return "Thank you! Your request has been saved. Goodbye!"
        
        else:
            return "I'm sorry, please repeat what you need help with."
    
    # Fallback response
    return "Please tell me what you need help with."

def simple_ai_response(user_input, state):
    # Used by the call_routes.py
    print(f"Generating simple AI response for state: {state}")

    if state == 'greeting':
        return f"I heard: '{user_input}'. Is this correct? Say yes or no."
    
    elif state == 'confirmation':
        if 'yes' in user_input.lower():
            return "Thank you! Your request has been recorded. Goodbye!"
        
        else:
            return "Please repeat what you need help with."
    
    else:
        return "How can I help you today?"

def test_openai_setup():
    # Test if OpenAI is configured correctly
    try:
        if Config.OPENAI_API_KEY:
            print("OpenAI API key is set")
            return True
        
        else:
            print("OpenAI API key is not set")
            return False
    
    except Exception as e:
        print(f"Error checking OpenAI setup: {e}")
        return False