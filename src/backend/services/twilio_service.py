# src/backend/services/twilio_service.py
from twilio.rest import Client
from src.config import Config

client = Client(Config.TWILIO_ACCOUNT_SID, Config.TWILIO_AUTH_TOKEN)

def make_call(to_number):
    call = client.calls.create(
        url=f"https://draconially-bondless-shin.ngrok-free.dev/twilio/voice",  # Your webhook URL
        to=to_number,
        from_=Config.TWILIO_PHONE_NUMBER
    )
    return call.sid