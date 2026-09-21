from flask import Blueprint, request, jsonify
from chatbot.llm_service import generate_response
from tts.speech_service import text_to_speech


chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json()

        user_message = data.get("message", "").strip()

        if not user_message:

            return jsonify({
                "success": False,
                "message": "Please enter a message."
            }), 400

        # Generate AI response
        bot_response = generate_response(user_message)

        # Convert AI response to speech
        audio_filename = text_to_speech(bot_response)

        if not audio_filename:

            return jsonify({
                "success": False,
                "message": "Could not generate voice."
            }), 500

        return jsonify({
            "success": True,
            "user_message": user_message,
            "response": bot_response,
            "audio": f"/audio/{audio_filename}"
        })

    except Exception as e:

        print("Chat Error:", e)

        return jsonify({
            "success": False,
            "message": "Something went wrong."
        }), 500