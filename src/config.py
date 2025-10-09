from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    @classmethod
    def validate(cls):
        # Validate that all required environment variables are set
        required = {
            "TWILIO_ACCOUNT_SID": cls.TWILIO_ACCOUNT_SID,
            "TWILIO_AUTH_TOKEN": cls.TWILIO_AUTH_TOKEN,
            "TWILIO_PHONE_NUMBER": cls.TWILIO_PHONE_NUMBER,
            "OPENAI_API_KEY": cls.OPENAI_API_KEY
        }
        
        missing = [key for key, value in required.items() if not value]
        if missing:
            raise ValueError(f"Missing environment variables: {', '.join(missing)}")
        
        print("All environment variables loaded successfully")