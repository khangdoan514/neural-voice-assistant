from datetime import datetime
import os

def save_conversation(call_sid, user_info, user_request, conversation_history):
    # Create conversations folder if it doesn't exist
    os.makedirs('../conversations', exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y-%m-%d:%H-%M-%S")
    filename = f"../conversations/service_ticket_{call_sid}.txt"
    
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("=" * 60 + "\n")
            f.write("SERVICE REQUEST TICKET\n")
            f.write("=" * 60 + "\n")
            f.write(f"Ticket ID: {call_sid}\n")
            f.write(f"Timestamp: {timestamp}\n")
            f.write("\n")
            
            f.write("CUSTOMER INFORMATION:\n")
            f.write("-" * 40 + "\n")
            f.write(f"Phone: {user_info.get('phone_number', 'Not provided')}\n")
            f.write(f"Name: {user_info.get('name', 'Not provided')}\n")
            f.write(f"Location: {user_info.get('location', 'Not provided')}\n")
            f.write("\n")
            
            f.write("SERVICE REQUEST:\n")
            f.write("-" * 40 + "\n")
            f.write(f"{user_request}\n")
            f.write("\n")
            
            f.write("CONVERSATION HISTORY:\n")
            f.write("-" * 40 + "\n")
            
            for i, exchange in enumerate(conversation_history, 1):
                f.write(f"\n[{i}] User: {exchange.get('user', 'N/A')}\n")
                f.write(f"[{i}] AI: {exchange.get('ai', 'N/A')}\n")
            
            f.write("\n" + "=" * 60 + "\n")
            f.write("END OF TICKET\n")
            f.write("=" * 60 + "\n")
        
        print(f"Service ticket saved: {filename}")
        return True
        
    except Exception as e:
        print(f"ERROR: Failed to save service ticket: {e}")
        return False