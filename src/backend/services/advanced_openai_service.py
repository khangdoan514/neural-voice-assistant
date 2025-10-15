from .openai_service import generate_response
from openai import OpenAI
from config import Config

# Initialize OpenAI client
client = OpenAI(api_key=Config.OPENAI_API_KEY)

def generate_advanced_response(user_input, state, conversation_history=None):
    try:
        # For confirmation state with "yes", use custom response
        if state == 'confirmation' and any(word in user_input.lower() for word in ['yes', 'correct', 'right', 'yeah', 'yep', 'uh-huh', 'ok', 'okay']):
            return "Is that all you need help with?"
        
        # Conversation context for GPT
        messages = build_conversation(conversation_history or [], user_input, state)
        
        # Call GPT-4o
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=500,
            temperature=0.8
        )
        
        ai_response = response.choices[0].message.content.strip()
        print(f"AI response: '{ai_response}'")
        return ai_response
        
    except Exception:
        print(f"ERROR: GPT-4o failed.")
        # Use generate_response from openai_service.py
        return generate_response(user_input, state)

def build_conversation(history, current_transcript, state):
    # Conversation context for GPT
    system_prompt = """
    You are Alice, a friendly and professional AI assistant handling phone calls.
    
    CONVERSATION GOALS:
    1. Be natural, conversational, and warm
    2. Keep responses concise (1-2 sentences max) for phone conversations
    3. Sound human-like - use casual language, occasional "um", "okay", "I see"
    4. Maintain smooth flow - acknowledge then respond naturally
    
    VOICE OPTIMIZATION:
    - Use contractions: "I'm", "you're", "that's"
    - Avoid complex sentences
    - Sound empathetic and engaged
    - Pause naturally between thoughts
    
    Example good response: "Okay, I understand you need help with your account. Let me get that sorted for you."
    Example bad response: "I have processed your request for account assistance. Please proceed with the following steps."
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
        'greeting': f"User just said: '{current_transcript}'. Confirm what you heard in a natural, conversational way and ask if it's correct.",
        'confirmation': f"User is responding to your confirmation: '{current_transcript}'. Respond naturally and continue the conversation flow."
    }
    
    current_message = state_context.get(state, f"User said: '{current_transcript}'. Respond in a natural, conversational way.")
    messages.append({"role": "user", "content": current_message})
    
    return messages