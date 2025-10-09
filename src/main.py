from backend.routes.call_routes import call_bp
from flask import Flask

# Initialize Flask app
app = Flask(__name__)

# Register blueprints
app.register_blueprint(call_bp)

@app.route("/")
def hello():
    return "Hello World :D"

@app.route('/health')
def health_check():
    return "OK", 200

if __name__ == "__main__":
    print("Starting Neural Voice Assistant...")
    app.run(host='0.0.0.0', port=5001, debug=False)