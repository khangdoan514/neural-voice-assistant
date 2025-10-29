from backend.routes.call_routes import call_bp
from flask import Flask # type: ignore
import logging

# Add the current directory to Python path so imports work
sys.path.insert(0, os.path.dirname(__file__))

# Disable loggings
logging.getLogger('werkzeug').disabled = True
logging.getLogger('flask.app').disabled = True

# Initialize Flask app
app = Flask(__name__)
app.register_blueprint(call_bp, url_prefix='/twilio')

@app.route("/")
def home():
    return "VoiceFlow is running!", 200

@app.route('/health')
def health():
    return "OK", 200

@app.route('/ngrok-test')
def ngrok_test():
    return "Ngrok test successful!", 200

if __name__ == "__main__":
    print("Starting VoiceFlow...")
    print("In another terminal: ngrok http 5001")
    app.run(host='0.0.0.0', port=5001, debug=False)