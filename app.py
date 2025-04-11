from flask import Flask, request, jsonify

from flask_cors import CORS
import requests
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define Moh's Character
MOH_IDENTITY = """
You are MOH AIMate, a friendly and helpful AI assistant, who helps you build your relationship with anyone. 
You are knowledgeable, supportive, and always ready to help with any questions related to romantic feelings or cases.
Your responses should be concise, informative, and friendly.
If someone asks your name or who you are, respond: 'I am MOH AIMate, your personal AI assistant.'
If someone asks who created you, respond: 'I am MOH AIMate, created by Krrish Keshav. He is a very handsome, caring man. He is 19 years old and currently a student. He is from Uttarakhand, Dehradun.'
"""

# Get API Key from environment variable
os.environ["API_KEY"] = "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"
API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Initialize conversation history with system prompt
conversation_histories = {}

@app.route('/')
def home():
    return "Welcome to MOH AIMate!"

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages and return AI responses."""
    try:
        data = request.json
        user_input = data.get("message")
        session_id = data.get("session_id", "default")  # Use session_id to maintain separate conversations
        
        if not user_input:
            return jsonify({"error": "Message is required"}), 400
        
        # Initialize conversation history for new sessions
        if session_id not in conversation_histories:
            conversation_histories[session_id] = [{"role": "system", "content": MOH_IDENTITY}]
        
        # Get the conversation history for this session
        conversation_history = conversation_histories[session_id]
        
        # Add user message to history
        conversation_history.append({"role": "user", "content": user_input})
        
        # Prepare request to OpenRouter
        headers = {
            "Authorization": f"Bearer {os.getenv('API_KEY')}",
            "Content-Type": "application/json"
        }
        
        # For API request, use the full history but limit to last 20 messages to avoid token limits
        api_conversation_history = conversation_history
        if len(conversation_history) > 21:  # system message + 20 conversation turns
            api_conversation_history = [conversation_history[0]] + conversation_history[-20:]
        
        payload = {
            "model": "google/gemini-2.0-flash-001",
            "messages": api_conversation_history,
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        # Make request to OpenRouter
        response = requests.post(API_URL, headers=headers, json=payload)
        
        if response.status_code == 200:
            json_response = response.json()
            if "choices" in json_response and json_response["choices"]:
                bot_response = json_response["choices"][0]["message"]["content"]
                # Add assistant response to history (full history is maintained)
                conversation_history.append({"role": "assistant", "content": bot_response})
                # We keep the full history in memory but limit what we send to the API
                return jsonify({"response": bot_response})
            
            return jsonify({"response": "Sorry, I didn't understand that."})
        
        logger.error(f"OpenRouter API error: {response.status_code} - {response.text}")
        return jsonify({"response": "I'm having trouble connecting to my knowledge base. Please try again later."}), 500
    
    except Exception as e:
        logger.exception("Error in chat endpoint")
        return jsonify({"response": "An error occurred while processing your request."}), 500

@app.route('/reset', methods=['POST'])
def reset_conversation():
    """Reset the conversation history for a session."""
    data = request.json
    session_id = data.get("session_id", "default")
    
    if session_id in conversation_histories:
        conversation_histories[session_id] = [{"role": "system", "content": MOH_IDENTITY}]
    
    return jsonify({"status": "Conversation reset successfully"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
