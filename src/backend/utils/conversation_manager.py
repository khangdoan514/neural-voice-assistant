class ConversationManager:
    def __init__(self):
        self.active_conversations = {}
    
    def start_conversation(self, call_sid):
        self.active_conversations[call_sid] = {
            'history': [],
            'state': 'language_selection', # language_selection → greeting → listening → confirmation → complete
            'user_request': None,
            'language': 'en' # default
        }
    
    def update_conversation(self, call_sid, user_input, ai_response, state):
        if call_sid in self.active_conversations:
            self.active_conversations[call_sid]['history'].append({
                'user': user_input,
                'ai': ai_response
            })

            self.active_conversations[call_sid]['state'] = state
            print(f"Conversation state: {state}\n")
    
    def set_user_request(self, call_sid, request):
        if call_sid in self.active_conversations:
            self.active_conversations[call_sid]['user_request'] = request
    
    def get_user_request(self, call_sid):
        return self.active_conversations.get(call_sid, {}).get('user_request')
    
    def set_language(self, call_sid, language):
        if call_sid in self.active_conversations:
            self.active_conversations[call_sid]['language'] = language
    
    def get_language(self, call_sid):
        return self.active_conversations.get(call_sid, {}).get('language', 'en')
    
    def get_conversation_state(self, call_sid):
        return self.active_conversations.get(call_sid, {}).get('state', 'ended')
    
    def get_conversation_history(self, call_sid):
        return self.active_conversations.get(call_sid, {}).get('history', [])
    
    def end_conversation(self, call_sid):
        if call_sid in self.active_conversations:
            del self.active_conversations[call_sid]
            print(f"End.")