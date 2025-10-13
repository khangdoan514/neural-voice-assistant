from .openai_service import generate_response
from openai import OpenAI
from config import Config

# Initialize OpenAI client
client = OpenAI(api_key=Config.OPENAI_API_KEY)

def generate_advanced_response(user_input, state, conversation_history=None):
    try:
        # Conversation context for GPT
        messages = build_conversation(conversation_history or [], user_input, state)
        
        # Call GPT-3.5 Turbo
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=200,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content.strip()
        print(f"AI response: '{ai_response}'")
        return ai_response
        
    except Exception as e:
        print(f"GPT Error: {e}")
        # Use generate_response from openai_service.py
        return generate_response(user_input, state)

def build_conversation(history, current_transcript, state):
    # Conversation context for GPT
    system_prompt = """
    You are a helpful AI assistant that handles phone calls. 
    Your role is to confirm user requests and provide helpful responses.
    
    Conversation flow:
    1. Greeting: User states their need, you confirm what you heard
    2. Confirmation: User confirms or denies your understanding
    3. After confirmation: Continue the conversation naturally
    
    Keep responses natural, conversational, and concise (1-2 sentences max).
    Speak like a friendly customer service agent.
    
    IMPORTANT: After user confirms their request is correct, continue the conversation
    by asking if they need help with anything else or offering further assistance.
    DO NOT end the conversation abruptly.
    """
    
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add conversation history for context
    for exchange in history:
        if exchange.get('user'):
            messages.append({"role": "user", "content": exchange['user']})
        
        if exchange.get('ai'):
            messages.append({"role": "assistant", "content": exchange['ai']})
    
    # Add current user input with state context
    state_context = {
        'greeting': f"User is stating their initial request: '{current_transcript}'. Confirm what you heard and ask if it's correct.",
        'confirmation': f"User is responding to your confirmation request: '{current_transcript}'. Process their yes/no response and continue the conversation naturally."
    }
    
    current_message = state_context.get(state, f"User said: '{current_transcript}'. Respond naturally and continue the conversation.")
    messages.append({"role": "user", "content": current_message})
    
    return messages