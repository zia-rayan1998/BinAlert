# Full Stack & ML Integration Guide

This guide details how to transition this application from a frontend prototype to a fully functional full-stack system with a local database and a custom Machine Learning model.

---

## Part 1: Local Database & Backend Setup

We will use **FastAPI** (Python) for the server and **PostgreSQL** for the database.

### 1. Folder Structure
Create a folder named `backend` in the root directory. Your project should look like this:

```
/
├── backend/
│   ├── ml/                 <-- Your Machine Learning Folder
│   ├── database.py         <-- DB Connection
│   ├── main.py             <-- API Server
│   ├── models.py           <-- DB Tables
│   ├── requirements.txt
│   └── Dockerfile
├── src/                    <-- Existing React Frontend
├── docker-compose.yml
└── ...
```

### 2. Create Backend Files

**A. `backend/database.py`**
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Use environment variable or default to localhost
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/binalert_db")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
```

**B. `backend/models.py`**
```python
from sqlalchemy import Column, Integer, String, Float, Boolean, ARRAY
from database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    overflow_level = Column(Integer)
    urgency = Column(String)
    waste_types = Column(String) # Stored as comma-separated string
    status = Column(String, default="PENDING")
    ai_analysis = Column(String)
```

**C. `backend/main.py`**
```python
from fastapi import FastAPI, Depends, UploadFile, File
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
import models
from fastapi.middleware.cors import CORSMiddleware

# Create tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "BinAlert Backend is Running"}

@app.post("/reports/")
def create_report(
    latitude: float, 
    longitude: float, 
    db: Session = Depends(get_db)
):
    # Logic to save report
    return {"status": "Report Saved"}
```

**D. `backend/Dockerfile`**
```dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 3. Run Everything Locally (Docker)
Ensure you have Docker Desktop installed.

1. Open your terminal in the project root.
2. Run:
   ```bash
   docker-compose up --build
   ```
3. This will start:
   - **PostgreSQL** on port 5432
   - **Backend** on http://localhost:8000
   - **Frontend** on http://localhost:3000

---

## Part 2: Custom ML Model Training & Integration

This section explains how to replace the Gemini API with your own TensorFlow model.

### 1. Setup ML Folder
Inside `backend/`, create a folder named `ml`.
```
backend/ml/
├── datasets/           <-- Put your downloaded images here
│   ├── overflow/
│   └── empty/
├── train_model.py      <-- The training script
└── garbage_model.h5    <-- The saved model (generated later)
```

### 2. Download Datasets
Download datasets (e.g., from Kaggle "Garbage Classification" or Roboflow) and extract them into `backend/ml/datasets/`. Ensure you have separate folders for each class (e.g., `Organic`, `Plastic`, `Metal`).

### 3. Create Training Script (`backend/ml/train_model.py`)
Run this script manually on your machine to generate the model file.

```python
import tensorflow as tf
from tensorflow.keras import layers, models

# Config
DATA_DIR = "./datasets"
IMG_SIZE = (224, 224)
BATCH_SIZE = 32

# 1. Load Data
train_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

# 2. Build Model (Transfer Learning with MobileNetV2)
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet'
)
base_model.trainable = False # Freeze base

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.2),
    layers.Dense(3, activation='softmax') # Change 3 to number of classes
])

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# 3. Train
epochs = 10
history = model.fit(train_ds, validation_data=val_ds, epochs=epochs)

# 4. Save
model.save("garbage_model.h5")
print("Model saved as garbage_model.h5")
```

### 4. Integrate Model into Backend (`backend/main.py`)
Update your `main.py` to load this model and predict.

```python
import tensorflow as tf
import numpy as np
from PIL import Image
import io

# Load Model ONCE when app starts
model = tf.keras.models.load_model("ml/garbage_model.h5")
CLASS_NAMES = ["Empty", "Overflowing", "Fire"] # Match your dataset folders

@app.post("/analyze-image/")
async def analyze_image(file: UploadFile = File(...)):
    # 1. Read Image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).resize((224, 224))
    
    # 2. Preprocess
    img_array = tf.keras.utils.img_to_array(image)
    img_array = tf.expand_dims(img_array, 0) # Create batch axis

    # 3. Predict
    predictions = model.predict(img_array)
    score = tf.nn.softmax(predictions[0])
    class_index = np.argmax(score)
    confidence = 100 * np.max(score)

    result_class = CLASS_NAMES[class_index]
    
    # 4. Logic mapping
    urgency = "LOW"
    if result_class == "Fire":
        urgency = "CRITICAL"
    elif result_class == "Overflowing":
        urgency = "HIGH"

    return {
        "overflowLevel": confidence if result_class != "Empty" else 10,
        "urgency": urgency,
        "description": f"Detected {result_class} with {confidence:.2f}% confidence"
    }
```

---

## Part 3: Deployment

### Deployment Option 1: Docker (Recommended)
Since you now have a database and python code, you cannot use simple static hosting (Vercel) for the backend. You must use a container service (AWS ECS, DigitalOcean App Platform, Render, or Railway).

1. **Push to GitHub**: Commit all your files.
2. **Render/Railway**: Connect your GitHub repo.
3. **Configuration**:
   - Point the deployment to use the `Dockerfile` in the root (for frontend) or `backend/Dockerfile` (for backend).
   - Ideally, deploy the backend as a "Web Service" and the frontend as a "Static Site" (if using API URLs) or another "Web Service".
   - **Database**: Most providers (Render/Railway) allow you to click "Add PostgreSQL Database". Copy the connection string they give you (e.g., `postgres://user:pass@host/db`) and set it as an Environment Variable `DATABASE_URL` in your backend service.

### Deployment Option 2: Vercel (Frontend Only)
You can still host the **React Frontend** on Vercel.
1. Deploy the frontend to Vercel.
2. Deploy the backend to Heroku/Render/AWS.
3. In Vercel, set the environment variable `VITE_API_URL` to point to your deployed backend URL.
