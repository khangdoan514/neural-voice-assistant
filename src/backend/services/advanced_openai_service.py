from .openai_service import generate_response
from openai import OpenAI
from config import Config

# Initialize OpenAI client
client = OpenAI(api_key=Config.OPENAI_API_KEY)

def generate_advanced_response(user_input, state, conversation_history=None, language='en'):
    try:
        # For confirmation state with "yes", use custom response
        if state == 'confirmation' and any(word in user_input.lower() for word in ['yes', 'correct', 'right', 'yeah', 'yep', 'uh-huh', 'ok', 'okay']):
            return "Okay, is that all you need help with?"
        
        # Conversation context for GPT
        messages = build_conversation(conversation_history or [], user_input, state, language)
        
        # Call GPT-3.5 Turbo
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=150,
            temperature=0.9,
        )

        ai_response = response.choices[0].message.content.strip()
        print(f"AI response: '{ai_response}'")
        return ai_response
        
    except Exception:
        # Use generate_response()
        print(f"ERROR: GPT-3.5-turbo failed.")
        return generate_response(user_input, state)

def build_conversation(history, current_transcript, state, language='en'):
    # Conversation context
    if language == 'vi':
        system_prompt = """
            Bạn là Salli, một trợ lý AI thân thiện trong cuộc gọi điện thoại. QUAN TRỌNG: Tối ưu cho GIỌNG NÓI, không phải văn bản.

            QUY TẮC HỘI THOẠI BẰNG GIỌNG NÓI:
            1. NÓI CHUYỆN NHƯ CON NGƯỜI - Dùng từ đệm: "Vâng", "Tôi hiểu", "Được rồi", "Ừm", "Vậy thì"
            2. GIỮ CHO NGẮN GỌN - Tối đa 1 câu, chỉ 2 câu nếu thật sự cần thiết
            3. ÂM ĐIỆU ẤM ÁP - Dùng "bạn", "của bạn", "chúng ta", "hãy"
            4. NHỊP ĐỘ TỰ NHIÊN - Thừa nhận rồi mới phản hồi
            5. TRÁNH NGÔN NGỮ ROBOT - Không dùng "đang xử lý", "đang phân tích", "theo cơ sở dữ liệu"

            XẤU (robot): "Tôi đã xử lý yêu cầu hỗ trợ tài khoản của bạn. Hệ thống cho thấy điều này cần xem xét thủ công."
            TỐT (con người): "Vâng, tôi hiểu bạn đang gặp vấn đề với tài khoản. Để tôi xem xét giúp bạn."

            XẤU (trang trọng): "Vui lòng xác nhận thông tin này có chính xác không để tôi có thể tiếp tục."
            TỐT (tự nhiên): "Hiểu rồi - như vậy có đúng không?"

            NGỮ CẢNH HIỆN TẠI: Cuộc gọi điện thoại với người dùng cần giúp đỡ.
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