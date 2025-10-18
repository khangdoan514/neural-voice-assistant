from config import Config
from twilio.rest import Client # type: ignore
from twilio.request_validator import RequestValidator # type: ignore

client = Client(Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN)

def validate_twilio_signature(request):
    try:
        validator = RequestValidator(Config.TWILIO_AUTH_TOKEN)
        
        # Signature from Twilio
        signature = request.headers.get('X-Twilio-Signature') or request.headers.get('x-twilio-signature', '')
        
        if not validator.validate(request.url, request.form, signature):
            print(f"WARNING: Invalid Twilio signature detected")
            
        return True
        
    except Exception:
        print(f"ERROR: Twilio signature validation failed.")
        return False