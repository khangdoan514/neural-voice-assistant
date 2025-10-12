from backend.routes.call_routes import call_bp
from flask import Flask

# Initialize Flask app
app = Flask(__name__)

# Register blueprints
app.register_blueprint(call_bp)

@app.route("/")
def hello():
    return "VoiceFlow is running!", 200

@app.route('/health')
def health_check():
    return "OK", 200

@app.route('/ngrok-test')
def ngrok_test():
    return "Ngrok test successful!", 200

if __name__ == "__main__":
    print("Starting VoiceFlow...")
    app.run(host='0.0.0.0', port=5001, debug=False)