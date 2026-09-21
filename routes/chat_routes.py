from flask import (
    Blueprint,
    request,
    jsonify
)


from chatbot.llm_service import (
    generate_response
)


from tts.speech_service import (
    text_to_speech
)


# Create Blueprint
chat_bp = Blueprint(
    "chat",
    __name__
)


@chat_bp.route(
    "/chat",
    methods=["POST"]
)
def chat():

    try:

        # Get JSON data
        data = request.get_json(
            silent=True
        ) or {}


        # Get message
        user_message = data.get(
            "message",
            ""
        ).strip()


        # Check message
        if not user_message:

            return jsonify({

                "success": False,

                "message":
                    "Please enter or speak a message."

            }), 400


        print(
            "User:",
            user_message
        )


        # --------------------------------
        # Generate AI response
        # --------------------------------

        bot_response = generate_response(
            user_message
        )


        print(
            "AI:",
            bot_response
        )


        # --------------------------------
        # Convert response to speech
        # --------------------------------

        audio_filename = text_to_speech(
            bot_response
        )


        if not audio_filename:

            return jsonify({

                "success": False,

                "message":
                    "Voice generation failed."

            }), 500


        # --------------------------------
        # Return response
        # --------------------------------

        return jsonify({

            "success": True,

            "user_message":
                user_message,

            "response":
                bot_response,

            "audio":
                f"/audio/{audio_filename}"

        })


    except Exception as e:

        print(
            "Chat Route Error:",
            e
        )


        return jsonify({

            "success": False,

            "message":
                "Something went wrong. "
                "Please try again."

        }), 500