from config import Config
from twilio.rest import Client

client = Client(Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN)

def make_call(to_number, webhook_url):
    try:
        call = client.calls.create(
            url=webhook_url,
            to=to_number,
            from_=Config.TWILIO_PHONE_NUMBER
        )
        
        print(f"Call initiated: {call.sid}")
        return call.sid
    
    except Exception:
        print(f"ERROR: Failed to make call.")
        return None

def validate_twilio_signature(request):
    # True for now, validate Twilio signatures later
    return True