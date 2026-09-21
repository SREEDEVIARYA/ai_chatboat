from google import genai
from config.config import GEMINI_API_KEY


client = genai.Client(api_key=GEMINI_API_KEY)


def generate_response(user_message):

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_message
        )

        return response.text

    except Exception as e:
        print("Gemini Error:", e)

        return "Sorry, I could not generate a response at the moment."