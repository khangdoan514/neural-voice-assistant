from backend.routes.call_routes import call_bp
from flask import Flask

app = Flask(__name__)
app.register_blueprint(call_bp)

@app.route("/")
def hello():
    return "Hello World :D"

if __name__ == "__main__":
    print("Flask app starting...")
    app.run(host='0.0.0.0', port=5001, debug=False)