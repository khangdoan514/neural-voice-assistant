from ..utils.intent_detector import users_say_yes
from .openai_service import generate_response

from config import Config
from openai import OpenAI # type: ignore

# Initialize OpenAI client
client = OpenAI(api_key=Config.OPENAI_API_KEY)

# process_recording() in call_routes.py
def generate_advanced_response(user_input, state, conversation_history=None, language='en'):
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
    if language == 'vi':
        system_prompt = """
            QUAN TRỌNG: Chỉ trả lời 1 câu ngắn gọn và LUÔN hỏi xác nhận.
    
            LUỒNG HỘI THOẠI:
            1. Khi người dùng nói yêu cầu: Xác nhận yêu cầu và hỏi "Như vậy có đúng không?"
            2. Khi người dùng xác nhận: Hỏi "Có phải đó là tất cả những gì bạn cần giúp không?"
            
            LUÔN giữ câu trả lời NGẮN GỌN (1 câu).
        """
    
    else:
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