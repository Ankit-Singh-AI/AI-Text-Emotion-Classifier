from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from keras.models import load_model
import numpy as np
import pickle
import re


"""
1. We are going to make some constants like:
a. Model Path (BiGRU)
b. Tokenizer Path
c. Max Sequence Length
d. Emotion Labels
e. Emotion emojis
"""

# a. Model Path (BiGRU)
model_path = "Model/BiGRU_Model.keras"

# b. Tokenizer Path
tokenizer_path = "Model/tokenizer.pkl"

# c. Max Sequence Length
max_sequence_length = 50

# d. Emotion Labels
emotion_labels = ["sadness", "joy", "love", "anger", "fear", "surprise"]

# e. Emotion emojis
EMOTION_EMOJIS = {
    "sadness": "😢",
    "joy": "😄",
    "love": "❤️",
    "anger": "😠",
    "fear": "😨",
    "surprise": "😲",
}

"""
2. Preprocess the upcoming text
cleans raw text so it matches the format used while training.
a. Convert the text to lowercase
b. Remove apostrophes (example: can't -> cant)
c. Remove special characters and punctuation (example: @, #, $, %, etc.)
d. Remove extra spaces
"""

def preprocess_text(text: str)->str:
    text = text.lower()
    text = re.sub(r"'","",text)
    text = re.sub(r"[^a-z0-9\s]","",text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


"""
3. Request and Response Schemas
a. Text Input -> Input Schema the text sent by user.
b. Prediction Response -> Output Schema the emotion predicted by the model.
c. Health Response (Server Health Check)
"""

class TextInput(BaseModel):
    text : str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="The sentence to analyze",
        json_schema_extra={"example": "I feel so happy and excited"}
        )

class PredictionResponse(BaseModel):
    text : str 
    predicted_emotion: str
    confidence : float
    all_probabilities : dict[str, float]

class HealthResponse(BaseModel):
    status : str
    model_loaded : bool

"""
4. Model Loading and LifeSpan Management
Load the model and toknizer once the server starts up.
"""

dl_model = {} #{1. BiGRU, 2. Tokenizer}-> True , {} -> False

@asynccontextmanager
async def lifespan(app: FastAPI):
    print('Loading the model and tokenizer...')
    dl_model["BiGRU"] = load_model(model_path)                      #BiGRU Model
    with open(tokenizer_path, 'rb') as file:
        dl_model["Tokenizer"] = pickle.load(file)
    print('Model are loaded successfully...')   

    yield #Pause, model is laoded and server is running and at this point model wait karega for request

    dl_model.clear() #Ek baar server band ho gaya uske baad model ko memory se hata do.


"""
5. Mount the static files to the FastAPI app
A. Enable CORS (Cross-Origin Resource Sharing) to allow requests from different origins.
"""

app = FastAPI(
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount('/static', StaticFiles(directory="static"), name="statiC")


"""
6. API Endpoints
a. Server UI at homepage('/')
b. Health Check Endpoint ('/health')
c. Predict Emotion Endpoint('/predict')
"""

#a. Server UI at homepage('/')
@app.get('/', include_in_schema=False)
def server_ui():
    return FileResponse('static/index.html')

#b. Health Check Endpoint ('/health')
@app.get('/health', response_model=HealthResponse)
def health_check():
    return HealthResponse(status="Server is running", model_loaded=bool(dl_model))

#c. Predict Emotion Endpoint('/predict')
@app.post('/predict', response_model=PredictionResponse)
def predict_emotion(text_input: TextInput):
    """
    1. Cleans the input sentences.
    2. Convert the words into numeric using tokenizer.
    3. Pad the sequences to ensure uniform length.
    4. Run prediction using the BiGRU model.
    5. Return the top emotion and full probability breakdown.
    """

    BiGRU_model = dl_model.get("BiGRU")
    tokenizer_model = dl_model.get("Tokenizer")

    if BiGRU_model is None or tokenizer_model is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not loaded yet. Please try again later."
        )

    # 1. Clean the input text
    cleaned_text = preprocess_text(text_input.text)

    # 2. Convert text into sequence
    tokenized_text = tokenizer_model.texts_to_sequences([cleaned_text])

    # 3. Pad sequence
    padded_sequence = pad_sequences(
        tokenized_text,
        maxlen=max_sequence_length,
        padding="post",
        truncating="post"
    )

    # 4. Model prediction
    probabilities = BiGRU_model.predict(padded_sequence)[0]

    # Get the index of highest probability
    top_emotion_index = int(np.argmax(probabilities))

    # Create probability dictionary
    all_probabilities = {
        label: float(prob)
        for prob, label in zip(probabilities, emotion_labels)
    }

    # 5. Return prediction
    return PredictionResponse(
        text=text_input.text,
        predicted_emotion=emotion_labels[top_emotion_index],
        confidence=float(probabilities[top_emotion_index]),
        all_probabilities=all_probabilities
    )