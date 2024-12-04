
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
import joblib

# Load dataset
data = pd.read_csv('path_to_dataset.csv')

# Preprocess data
X = data['symptoms']
y = data['condition']

# Create a pipeline with TfidfVectorizer and LogisticRegression
model = make_pipeline(TfidfVectorizer(), LogisticRegression())

# Train the model
model.fit(X, y)

# Save the trained model
joblib.dump(model, 'trained_model.pkl')