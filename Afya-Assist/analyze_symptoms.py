import sys
import spacy
import joblib

# Load the spaCy model
nlp = spacy.load('en_core_web_sm')

# Load the trained predictive model
model = joblib.load('trained_model.pkl')

# Define potential conditions based on symptoms
conditions = {
    "fever": ["Flu", "Common Cold", "COVID-19"],
    "cough": ["Common Cold", "Bronchitis", "COVID-19"],
    "headache": ["Migraine", "Tension Headache", "Cluster Headache"],
    # Add more symptoms and conditions as needed
}

def analyze_symptoms(symptoms):
    doc = nlp(symptoms)
    potential_conditions = set()

    for token in doc:
        if token.lemma_ in conditions:
            potential_conditions.update(conditions[token.lemma_])

    # Use the predictive model to analyze symptoms
    model_prediction = model.predict([symptoms])
    potential_conditions.update(model_prediction)

    return list(potential_conditions)

if __name__ == "__main__":
    symptoms = sys.argv[1]
    result = analyze_symptoms(symptoms)
    print(result)