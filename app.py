from flask import Flask, render_template, send_from_directory
from routes.chat_routes import chat_bp
import os


app = Flask(__name__)


# Register chatbot routes
app.register_blueprint(chat_bp)


# Home page
@app.route("/")
def home():

    return render_template("index.html")


# Serve audio files
@app.route("/audio/<filename>")
def serve_audio(filename):

    return send_from_directory(
        os.path.join(app.root_path, "audio"),
        filename
    )


if __name__ == "__main__":

    print("=" * 50)
    print("Text-to-Voice AI Chatbot")
    print("=" * 50)
    print("Open: http://127.0.0.1:5000")
    print("=" * 50)

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )