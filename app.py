from flask import (
    Flask,
    render_template,
    send_from_directory
)

import os


# Import chatbot blueprint
from routes.chat_routes import chat_bp


# Create Flask application
app = Flask(__name__)


# Register chatbot routes
app.register_blueprint(
    chat_bp
)


# ------------------------------------
# Home page
# ------------------------------------

@app.route("/")
def home():

    return render_template(
        "index.html"
    )


# ------------------------------------
# Serve audio files
# ------------------------------------

@app.route(
    "/audio/<filename>"
)
def serve_audio(filename):

    audio_folder = os.path.join(
        app.root_path,
        "audio"
    )


    return send_from_directory(
        audio_folder,
        filename
    )


# ------------------------------------
# Run application
# ------------------------------------

if __name__ == "__main__":

    print()
    print("=" * 60)
    print("       AI VOICE CHATBOT")
    print("=" * 60)
    print()
    print(
        "Open in browser:"
    )
    print(
        "http://127.0.0.1:5000"
    )
    print()
    print("=" * 60)


    app.run(

        host="127.0.0.1",

        port=5000,

        debug=True

    )