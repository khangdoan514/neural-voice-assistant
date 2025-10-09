class ConversationManager:
    def __init__(self):
        self.active_conversations = {}
    
    def start_conversation(self, call_sid):
        self.active_conversations[call_sid] = {
            'history': [],
            'state': 'greeting',  # greeting → listening → confirmation → complete
            'user_request': None
        }
        print(f"Started conversation for {call_sid}")
    
    def update_conversation(self, call_sid, user_input, ai_response, state):
        if call_sid in self.active_conversations:
            self.active_conversations[call_sid]['history'].append({
                'user': user_input,
                'ai': ai_response
            })
            self.active_conversations[call_sid]['state'] = state
            print(f"Updated conversation {call_sid} to state: {state}")
    
    def get_conversation_state(self, call_sid):
        return self.active_conversations.get(call_sid, {}).get('state', 'ended')
    
    def set_user_request(self, call_sid, request):
        if call_sid in self.active_conversations:
            self.active_conversations[call_sid]['user_request'] = request
            print(f"Set user request for {call_sid}: {request}")
    
    def get_user_request(self, call_sid):
        return self.active_conversations.get(call_sid, {}).get('user_request')
    
    def get_conversation_history(self, call_sid):
        return self.active_conversations.get(call_sid, {}).get('history', [])
    
    def end_conversation(self, call_sid):
        if call_sid in self.active_conversations:
            del self.active_conversations[call_sid]
            print(f"Ended conversation for {call_sid}")