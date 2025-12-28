from flask import Flask, request, jsonify
from flask_cors import CORS
# PENTING: Tambahkan titik (.) di depan chatbot_logic agar Vercel bisa menemukannya
from .chatbot_logic import get_bot_response 

app = Flask(__name__)

# Izinkan semua request (Penting karena domain Vercel berbeda dengan localhost)
CORS(app)

@app.route("/")
def home():
    return "Chatbot API Flask aktif"

# PENTING: Gunakan /api/chat agar sesuai dengan vercel.json Anda
@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json() or {}
        user_message = data.get("message", "")
        bot_response = get_bot_response(user_message)
        return jsonify({"response": bot_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# JANGAN gunakan app.run() di Vercel karena akan menyebabkan timeout
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)