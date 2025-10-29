from config import Config
from openai import OpenAI # type: ignore
from ..utils.intent_detector import users_say_yes
from .openai_service import generate_response

# Initialize OpenAI client
client = OpenAI(api_key=Config.OPENAI_API_KEY)

# process_recording() in call_routes.py
def generate_ai_response(user_input, state, conversation_history=None, language='en'):
    try:        
        # Users say "yes"
        if state == 'confirmation' and users_say_yes(user_input):
            if language == 'vi':
                return "Có phải đó là tất cả những gì bạn cần giúp không?"
            
            else:
                return "Is that all you need help with?"
                    
        # Conversation context
        messages = build_conversation(conversation_history or [], user_input, state, language)
        
        # Call GPT-3.5 Turbo
        response = client.chat.completions.create(
            model=Config.GPT_MODEL,
            messages=messages,
            max_tokens=Config.MAX_TOKENS,
            temperature=Config.TEMPERATURE,
        )

        ai_response = response.choices[0].message.content.strip()
        print(f"AI response: '{ai_response}'")
        return ai_response
        
    except Exception:
        print(f"ERROR: GPT-3.5-turbo failed in generate_advanced_response()")
        return generate_response(user_input, state)

def build_conversation(history, current_transcript, state, language='en'):
    # Conversation context
    if language == 'en':
        system_prompt = """
            You are Salli, a professional AI assistant handling phone calls. Maintain a balance between friendly and professional.

            CONVERSATION GUIDELINES:
            1. BE CLEAR AND PROFESSIONAL - Use complete sentences, avoid excessive filler words
            2. BE CONCISE - Keep responses brief but complete (1-2 sentences)
            3. BE HELPFUL - Focus on understanding and assisting the user
            4. USE NATURAL LANGUAGE - Sound human but maintain professionalism
            5. CONFIRM CLEARLY - Ensure accurate understanding of user requests

            PROFESSIONAL EXAMPLES:
            "I understand you need help with your internet connection. Is that correct?"
            "Thank you for confirming. I'll make sure your request is properly documented."
            "Could you please clarify what specific assistance you need?"

            AVOID:
            - Overly casual language: "Yeah", "Uh-huh", "No problemo"
            - Robotic terminology: "Processing", "System indicates", "Database query"
            - Vague responses: "Okay", "Got it", "I see"

            CURRENT CONTEXT: Professional customer service call where users need technical assistance.
        """
    
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add conversation history for context
    for exchange in history:
        if exchange.get('user'):
            messages.append({"role": "user", "content": exchange['user']})
        
        if exchange.get('ai'):
            messages.append({"role": "assistant", "content": exchange['ai']})
    
    # Add current user input with state context and language
    if language == 'vi':
        state_context = {
            'greeting': f"Người dùng vừa nói: '{current_transcript}'. Xác nhận những gì bạn nghe một cách tự nhiên, trò chuyện và hỏi xem có đúng không.",
            'confirmation': f"Người dùng đang phản hồi xác nhận của bạn: '{current_transcript}'. Phản hồi tự nhiên và tiếp tục cuộc trò chuyện."
        }
    
    else:
        state_context = {
            'greeting': f"User just said: '{current_transcript}'. Confirm what you heard in a natural, conversational way and ask if it's correct.",
            'confirmation': f"User is responding to your confirmation: '{current_transcript}'. Respond naturally and continue the conversation flow."
        }
    
    current_message = state_context.get(state, f"User said: '{current_transcript}'. Respond in a natural, conversational way.")
    messages.append({"role": "user", "content": current_message})
    
    return messages