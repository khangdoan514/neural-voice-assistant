class ConversationManager:
    def __init__(self):
        self.active_conversations = {}
    
    # New conversation: language_selection state
    def start_conversation(self, call_sid, phone_number=None):
        self.active_conversations[call_sid] = {
            'history': [],
            'state': 'language_selection', # language_selection → greeting → listening → confirmation → complete
            'user_request': None,
            'language': 'en', # default
            'user_info': {
                'phone_number': phone_number,
                'name': None,
                'location': None
            }
        }
    
    # Add to history and update state
    def update_conversation(self, call_sid, user_input, ai_response, state):
        if call_sid in self.active_conversations:
            self.active_conversations[call_sid]['history'].append({
                'user': user_input,
                'ai': ai_response
            })

            self.active_conversations[call_sid]['state'] = state
            print(f"Conversation state: {state}\n")
    
    # Save user's info
    def set_user_info(self, call_sid, field, value):
        if call_sid in self.active_conversations:
            self.active_conversations[call_sid]['user_info'][field] = value

    # Get user's info
    def get_user_info(self, call_sid):
        return self.active_conversations.get(call_sid, {}).get('user_info', {})

    # Save user's request
    def set_user_request(self, call_sid, request):
        if call_sid in self.active_conversations:
            self.active_conversations[call_sid]['user_request'] = request
    
    # Get user's request
    def get_user_request(self, call_sid):
        return self.active_conversations.get(call_sid, {}).get('user_request')
    
    # Set language preference
    def set_language(self, call_sid, language):
        if call_sid in self.active_conversations:
            self.active_conversations[call_sid]['language'] = language
    
    # Get current language
    def get_language(self, call_sid):
        return self.active_conversations.get(call_sid, {}).get('language', 'en')
    
    # Get conversation state
    def get_conversation_state(self, call_sid):
        return self.active_conversations.get(call_sid, {}).get('state', 'ended')
    
    # Get conversation history
    def get_conversation_history(self, call_sid):
        return self.active_conversations.get(call_sid, {}).get('history', [])
    
    # End and clean up conversation
    def end_conversation(self, call_sid):
        if call_sid in self.active_conversations:
            del self.active_conversations[call_sid]
            print(f"End.")