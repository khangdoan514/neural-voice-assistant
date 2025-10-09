# neural-voice-assistant/src/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
    TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')