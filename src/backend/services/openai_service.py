from src.config import Config
import openai
import requests

# Set up OpenAI
openai.api_key = Config.OPENAI_API_KEY

def transcribe_audio(audio_url):
    """
    Simple transcription function for now
    In a real implementation, you'd download the audio and use Whisper API
    """
    print(f"Would transcribe audio from: {audio_url}")
    
    # For now, return a mock transcript
    # In Step 10, we'll implement real transcription
    mock_transcripts = [
        "I need help with my account",
        "I want to reset my password", 
        "Can you help me with billing",
        "I have a technical problem"
    ]
    
    # Return a simple mock response for testing
    return "I need help with my account"

def generate_ai_response(transcript, conversation_state):
    """
    Generate AI response based on conversation state
    """
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
    """
    Simple rule-based responses for testing
    """
    if state == 'greeting':
        return f"I heard: '{user_input}'. Is this correct? Say yes or no."
    elif state == 'confirmation':
        if 'yes' in user_input.lower():
            return "Thank you! Your request has been recorded. Goodbye!"
        else:
            return "Please repeat what you need help with."
    else:
        return "How can I help you today?"