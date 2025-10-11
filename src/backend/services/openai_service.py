from config import Config
import openai
import requests
import os

# Set up OpenAI
openai.api_key = Config.OPENAI_API_KEY

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