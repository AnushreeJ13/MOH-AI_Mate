import streamlit as st
import speech_recognition as sr
from transformers import pipeline
from deep_translator import GoogleTranslator

# Load Pretrained Emotion Detection Model (English-based model)
emotion_model = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base",device=-1)

st.title("Ehsaas: Express Your Feelings")

# Function to suggest activities based on mood
def suggest_activity(mood):
    suggestions = {
        "anger": "🧘‍♂ Try deep breathing or meditation",
        "sadness": "🎶 Listen to music or talk to a friend",
        "fear": "📖 Read something comforting or do grounding exercises",
        "joy": "🎉 Celebrate your happiness, share with others!",
        "disgust": "🌿 Take a walk in nature or journal your thoughts",
        "surprise": "📝 Write down your feelings or express creativity"
    }
    return suggestions.get(mood.lower(), "💬 Join our community for support")

# Store session state for retry button
if "speech_attempted" not in st.session_state:
    st.session_state.speech_attempted = False  # Track if speech recognition was attempted

# Select Input Method
input_method = st.radio("How do you want to share?", ("Text", "Speech"))

if input_method == "Text":
    user_text = st.text_area("Write your thoughts here...")
    if st.button("Analyze Mood"):
        if user_text.strip():
            # Translate text to English
            translated_text = GoogleTranslator(source='auto', target='en').translate(user_text)
            st.write(f"Translated Text: {translated_text}")  # Show translated text for transparency
            mood_result = emotion_model(translated_text)[0]
            mood = mood_result["label"]
            st.write(f"**Detected Mood:** {mood}")
            st.write(f"**Suggested Activity:** {suggest_activity(mood)}")
        else:
            st.warning("Please enter some text before analyzing.")

elif input_method == "Speech":
    def recognize_speech():
        recognizer = sr.Recognizer()
        with sr.Microphone() as source:
            st.write("🎙 Speak now...")
            try:
                audio = recognizer.listen(source, timeout=5)
                text = recognizer.recognize_google(audio, language="en")  # Setting Hindi as the primary language
                st.write(f"🗣 You said: {text}")  # Show the recognized speech

                # Translate to English if needed
                translated_text = GoogleTranslator(source='auto', target="en").translate(text)
                st.write(f"Translated Text: {translated_text}")  # Show translated text for transparency
                
                # Run emotion model on the translated text
                mood_result = emotion_model(translated_text)[0]
                mood = mood_result["label"]
                st.write(f"**Detected Mood:** {mood}")
                st.write(f"**Suggested Activity:** {suggest_activity(mood)}")
                
                st.session_state.speech_attempted = False  # Reset state after success
            except sr.WaitTimeoutError:
                st.warning("⏳ No speech detected. Try again.")
                st.session_state.speech_attempted = True  # Enable retry
            except sr.UnknownValueError:
                st.warning("❌ Could not understand your speech. Try again.")
                st.session_state.speech_attempted = True  # Enable retry
            except sr.RequestError:
                st.error("⚠ Speech recognition service is unavailable. Check your internet connection.")
                st.session_state.speech_attempted = True  # Enable retry

    # Dynamic button: Shows "Start Listening" first, then "Retry"
    button_label = "Start Listening" if not st.session_state.speech_attempted else "Retry"
    if st.button(button_label):
        recognize_speech()
