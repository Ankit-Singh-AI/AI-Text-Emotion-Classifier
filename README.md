# 🧠 EmotionAI — Text Emotion Detection

> A deep learning based NLP application that detects emotions from text using a **Bidirectional GRU (BiGRU)** model.

EmotionAI takes a user's text as input, processes it using NLP techniques, and predicts one of six emotions along with the model's confidence and probability distribution.

---

## ✨ Features

* 🧠 BiGRU-based emotion classification
* 🎭 Detects 6 different emotions
* 📊 Confidence score and probability distribution
* 🔤 Text preprocessing and tokenization
* ⚡ FastAPI REST API
* 🎨 Modern interactive frontend
* 📱 Responsive UI
* 🚀 Render deployment ready

---

## 🎭 Supported Emotions

| Emotion  | Emoji |
| -------- | ----- |
| Sadness  | 😢    |
| Joy      | 😄    |
| Love     | ❤️    |
| Anger    | 😠    |
| Fear     | 😨    |
| Surprise | 😲    |

---

## 🛠️ Tech Stack

**Machine Learning**

* Python
* TensorFlow
* Keras
* NumPy
* NLP
* Bidirectional GRU

**Backend**

* FastAPI
* Uvicorn
* Pydantic

**Frontend**

* HTML5
* CSS3
* JavaScript

**Deployment**

* GitHub

---

## 🏗️ Project Structure

```text
EmotionAI/
│
├── Model/
│   ├── BiGRU_Model.keras
│   └── tokenizer.pkl
│
├── static/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── app.py
├── requirements.txt
├── runtime.txt
├── .gitignore
└── README.md
```

---

## 🔄 How It Works

```text
User Text
    ↓
Text Preprocessing
    ↓
Tokenizer
    ↓
Sequence Padding
    ↓
BiGRU Model
    ↓
Emotion Prediction
    ↓
Confidence + Probabilities
    ↓
Frontend Visualization
```

### Text Preprocessing

The input text is:

1. Converted to lowercase
2. Apostrophes are removed
3. Special characters are removed
4. Extra spaces are removed
5. Converted into numerical sequences
6. Padded to a maximum length of 50 tokens


---

## ⚙️ Run Locally

### 1. Clone Repository

```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

### 2. Create Virtual Environment

```bash
python -m venv .venv
```

### 3. Activate Environment

**Windows PowerShell:**

```bash
.venv\Scripts\Activate.ps1
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Start Application

```bash
uvicorn app:app --reload
```

Open:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---


### Build Command

```bash
pip install -r requirements.txt
```

### Start Command

```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

Python version is specified in:

```text
runtime.txt
```

---

## 🔮 Future Improvements

* Multilingual emotion detection
* More emotion categories
* Transformer/BERT-based models
* Prediction history
* Batch prediction
* Model performance dashboard
* Docker support
* Automated testing and CI/CD

---

## 📬 Connect with Me

* 💼 LinkedIn: https://www.linkedin.com/in/ankit-singh-35815333b/
* 🐙 GitHub: https://github.com/Ankit-Singh-AI
* 📧 Email: ankitsinghssps@gmail.com
---
