from flask import Flask, request, jsonify
from google import genai
from flask_cors import CORS
from gtts import gTTS

client = genai.Client(api_key="AIzaSyDaEhdj-zDKUKFqJIQQNkA6SN8qGjIjPi4")
theAnswers = []

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return "Balls"

@app.route("/api", methods=['POST'])
def generate():
    try:
        data = request.get_json()
        question = data.get("question")
        print(data)

        if not question:
            return jsonify({"error": "Missing 'question' in JSON data"}), 400

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"Answer the following prompt: {question}. At no point do you mention Google or Gemini or AI, you strictly answer what's relevant to the question asked. Do not become political or aggressive. If the user's questions veers off these rules, return a message saying you cannot help them with that request.",
        )
        text = response.text.replace("\n", " ").strip()
        theAnswers.insert(0, text)
        print(theAnswers)
        return jsonify({"response": theAnswers})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/tts", methods=['POST'])
def tts():

    try:
        data = request.get_json()
        content = data.get("content")

        if not content:
            return jsonify({"error": "Missing 'content' in JSON data"}), 400

        tts = gTTS(content)
        tts.save("./audios/bruh.mp3")
        return "Success"

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/tts", methods=['POST'])
def tts():

    try:
        data = request.get_json()
        content = data.get("content")

        if not content:
            return jsonify({"error": "Missing 'content' in JSON data"}), 400

        tts = gTTS(content)
        tts.save("./audios/bruh.mp3")
        return "Success"

    except Exception as e:
        return jsonify({"error": str(e)}), 500




if __name__ == "__main__":
    app.run(debug=True, port=5000)