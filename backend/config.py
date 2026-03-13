from dotenv import load_dotenv # type: ignore
import os

load_dotenv()

class Config:
    # API Keys
    TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

    # Application Settings
    RECORDING_TIMEOUT = 4 # seconds
    MAX_TOKENS = 150
    TEMPERATURE = 0.9
    
    # Model Settings
    GPT_MODEL = "gpt-3.5-turbo"
    WHISPER_MODEL = "whisper-1"
    TTS_MODEL = "tts-1"
    
    # Voice Settings
    ENGLISH_VOICE = "nova"
    VIETNAMESE_VOICE = "shimmer"
    
    @classmethod
    def validate(cls):
        required = {
            "TWILIO_ACCOUNT_SID": cls.TWILIO_ACCOUNT_SID,
            "TWILIO_AUTH_TOKEN": cls.TWILIO_AUTH_TOKEN,
            "TWILIO_PHONE_NUMBER": cls.TWILIO_PHONE_NUMBER,
            "OPENAI_API_KEY": cls.OPENAI_API_KEY
        }
        
        missing = [key for key, value in required.items() if not value]
        if missing:
            raise ValueError(f"ERROR: Missing environment variables: {', '.join(missing)}")