class ConversationManager:
    def __init__(self):
        self.conversations = {}
    
    # New conversation: language_selection state
    def start(self, call_sid, phone=None):
        self.conversations[call_sid] = {
            'history': [],
            'state': 'language_selection', # language_selection → greeting → listening → confirmation → complete
            'request': None,
            'language': 'en', # default
            'user_info': {
                'phone': phone,
                'name': None,
                'location': None
            }
        }
    
    # Add to history and update state
    def update(self, call_sid, user_input, ai_response, state):
        if call_sid in self.conversations:
            self.conversations[call_sid]['history'].append({
                'user': user_input,
                'ai': ai_response
            })

            self.conversations[call_sid]['state'] = state
            print(f"Conversation state: {state}\n")
    
    # Save user's info
    def set_info(self, call_sid, field, value):
        if call_sid in self.conversations:
            self.conversations[call_sid]['user_info'][field] = value

    # Get user's info
    def get_info(self, call_sid):
        return self.conversations.get(call_sid, {}).get('user_info', {})

    # Save user's request
    def set_request(self, call_sid, request):
        if call_sid in self.conversations:
            self.conversations[call_sid]['user_request'] = request
    
    # Get user's request
    def get_request(self, call_sid):
        return self.conversations.get(call_sid, {}).get('request')
    
    # Set language preference
    def set_language(self, call_sid, language):
        if call_sid in self.conversations:
            self.conversations[call_sid]['language'] = language
    
    # Get current language
    def get_language(self, call_sid):
        return self.conversations.get(call_sid, {}).get('language', 'en')
    
    # Get conversation state
    def get_state(self, call_sid):
        return self.conversations.get(call_sid, {}).get('state', 'ended')
    
    # Get conversation history
    def get_history(self, call_sid):
        return self.conversations.get(call_sid, {}).get('history', [])
    
    # End and clean up conversation
    def end(self, call_sid):
        if call_sid in self.conversations:
            del self.conversations[call_sid]
            print(f"End.")