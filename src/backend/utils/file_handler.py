from datetime import datetime
import os

def save_conversation(call_sid, user_request, conversation_history):
    # Create conversations folder if it doesn't exist
    os.makedirs('conversations', exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"conversations/conversation_{call_sid}_{timestamp}.txt"
    
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"Call SID: {call_sid}\n")
            f.write(f"Timestamp: {timestamp}\n")
            f.write(f"User Request: {user_request}\n")
            f.write("-" * 50 + "\n")
            f.write("CONVERSATION HISTORY:\n")
            f.write("-" * 50 + "\n")
            
            for i, exchange in enumerate(conversation_history, 1):
                f.write(f"\nExchange {i}:\n")
                f.write(f"User: {exchange.get('user', 'N/A')}\n")
                f.write(f"AI: {exchange.get('ai', 'N/A')}\n")
        
        print(f"Conversation saved to: {filename}")
        return True
    except Exception as e:
        print(f"Error saving conversation: {e}")
        return False