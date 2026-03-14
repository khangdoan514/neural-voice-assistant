from routes.call_routes import call_bp
from routes.conversation_routes import conversation_bp
from flask import Flask
from flask_cors import CORS
import logging

# Disable loggings
logging.getLogger('werkzeug').disabled = True
logging.getLogger('flask.app').disabled = True

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

# Register blueprints
app.register_blueprint(call_bp, url_prefix='/twilio')
app.register_blueprint(conversation_bp)

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