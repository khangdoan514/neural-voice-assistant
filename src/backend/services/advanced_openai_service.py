from .openai_service import generate_response
from openai import OpenAI
from config import Config

# Initialize OpenAI client
client = OpenAI(api_key=Config.OPENAI_API_KEY)

# Prevent stuttering
def smooth_response(response):
    # Remove words that commonly cause stuttering in TTS
    stuttering_triggers = {
        "the the": "the",
        "and and": "and",
        "to to": "to",
        "a a": "a",
        "is is": "is",
        "that that": "that",
        "it it": "it"
    }
    
    for trigger, replacement in stuttering_triggers.items():
        response = response.replace(trigger, replacement)
    
    # Simplify complex words
    simplifications = {
        "approximately": "about",
        "utilize": "use",
        "assistance": "help",
        "require": "need",
        "additional": "more"
    }
    
    for complex, simple in simplifications.items():
        response = response.replace(complex, simple)
    
    return response

def generate_advanced_response(user_input, state, conversation_history=None):
    try:
        # For confirmation state with "yes", use custom response
        if state == 'confirmation' and any(word in user_input.lower() for word in ['yes', 'correct', 'right', 'yeah', 'yep', 'uh-huh', 'ok', 'okay']):
            return smooth_response("Okay, is that all you need help with?")
        
        # Conversation context for GPT
        messages = build_conversation(conversation_history or [], user_input, state)
        
        # Call GPT-4o
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=150,
            temperature=0.9,
            presence_penalty=0.1,
            frequency_penalty=0.1
        )
        
        ai_response = smooth_response(response.choices[0].message.content.strip())
        print(f"AI response: '{ai_response}'")
        return ai_response
        
    except Exception:
        print(f"ERROR: GPT-4o failed.")
        # Use generate_response from openai_service.py
        return generate_response(user_input, state)

def build_conversation(history, current_transcript, state):
    # Conversation context for GPT
    system_prompt = """
    You are Salli, a friendly AI assistant on a phone call. CRITICAL: Optimize for SPEECH, not text.

    VOICE CONVERSATION RULES:
    1. SPEAK LIKE A HUMAN - Use filler words: "Okay", "I see", "Alright", "Um", "So"
    2. KEEP IT SHORT - 1 sentence max, 2 only if absolutely necessary
    3. SOUND WARM - Use "you", "your", "we", "let's"
    4. NATURAL PACING - Acknowledge then respond
    5. AVOID ROBOTIC LANGUAGE - No "processing", "analyzing", "according to my database"

    BAD (robotic): "I have processed your request for account assistance. The system indicates this requires manual review."
    GOOD (human): "Okay, I understand you're having account issues. Let me look into that for you."

    BAD (formal): "Please confirm if this information is correct so I may proceed."
    GOOD (natural): "Got it - is that right?"

    CURRENT CONTEXT: Phone call with a user who needs help.
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