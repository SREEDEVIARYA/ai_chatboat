from gtts import gTTS
import os
import uuid


AUDIO_FOLDER = "audio"


def text_to_speech(text):

    try:

        # Create audio directory if it doesn't exist
        os.makedirs(AUDIO_FOLDER, exist_ok=True)

        # Generate unique filename
        filename = f"response_{uuid.uuid4().hex}.mp3"

        filepath = os.path.join(AUDIO_FOLDER, filename)

        # Convert text to speech
        tts = gTTS(
            text=text,
            lang="en",
            slow=False
        )

        # Save audio
        tts.save(filepath)

        return filename

    except Exception as e:

        print("TTS Error:", e)

        return None