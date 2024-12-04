from flask import Flask, request, jsonify, abort
from flask_cors import CORS
import structlog
import requests
import os
from marshmallow import Schema, fields, ValidationError
import torch
import sys

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Initialize structured logging
structlog.configure(
    processors=[
        structlog.processors.JSONRenderer()
    ]
)
logger = structlog.get_logger()

# Preload AI models
ai_model = None
try:
    model_path = os.getenv("MODEL_PATH", "path/to/your_model.pt")
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}")
    ai_model = torch.load(model_path)
    logger.info("AI model loaded successfully", model_path=model_path)
except Exception as e:
    logger.error("Failed to load AI model", error=str(e))
    sys.exit("Failed to start the app: AI model loading failed.")  # Ensures app won't start without the model

# Infermedica Configuration
API_URL = os.getenv("INFERMEDICA_API_URL", "https://api.infermedica.com/v3")
HEADERS = {
    "App-Id": os.getenv("INFERMEDICA_APP_ID"),
    "App-Key": os.getenv("INFERMEDICA_API_KEY"),
    "Content-Type": "application/json",
}

# Define schemas for request validation
class SymptomCheckSchema(Schema):
    evidence = fields.List(fields.Dict(), required=True)

class TriageSchema(Schema):
    age = fields.Int(required=True, description="Patient's age")
    sex = fields.Str(required=True, validate=lambda x: x in ["male", "female"])
    evidence = fields.List(fields.Dict(), required=True, description="List of symptoms and conditions")

symptom_check_schema = SymptomCheckSchema()
triage_schema = TriageSchema()

def forward_request(endpoint, payload):
    """
    Utility to forward requests to the Infermedica API.

    Args:
        endpoint (str): The API endpoint to forward the request to.
        payload (dict): The JSON payload to send in the request.

    Returns:
        dict: The JSON response from the Infermedica API.

    Raises:
        werkzeug.exceptions.HTTPException: If the request to the Infermedica API fails.
    """
    try:
        response = requests.post(f"{API_URL}/{endpoint}", headers=HEADERS, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error("API request failed", endpoint=endpoint, error=str(e))
        abort(500, description="External API request failed.")

# Register blueprints
try:
    from routes import symptom_check_bp, triage_bp
    app.register_blueprint(symptom_check_bp)
    app.register_blueprint(triage_bp)
    logger.info("Blueprints registered successfully.")
except ImportError as e:
    logger.warning("Blueprints could not be registered. Proceeding without them.", error=str(e))

# Error handlers
@app.errorhandler(400)
def bad_request(error):
    response = jsonify({"error": "Bad Request", "message": error.description})
    response.status_code = 400
    return response

@app.errorhandler(500)
def internal_server_error(error):
    response = jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred."})
    response.status_code = 500
    return response

@app.errorhandler(ValidationError)
def handle_validation_error(error):
    response = jsonify({"error": "Validation Error", "message": error.messages})
    response.status_code = 400
    return response

@app.route('/predict', methods=['POST'])
def predict():
    """
    A sample endpoint for predictions using the preloaded AI model.
    Replace this with actual prediction logic as needed.
    """
    if ai_model is None:
        abort(500, description="AI model is not loaded.")

    try:
        input_data = request.json
        # Perform your prediction logic here using `ai_model`
        prediction = "Dummy prediction result"  # Replace with ai_model(input_data)
        return jsonify({"result": prediction}), 200
    except Exception as e:
        logger.error("Prediction failed", error=str(e))
        abort(500, description="Prediction failed.")

if __name__ == '__main__':
    port = int(os.getenv("FLASK_PORT", 5000))
    app.run(port=port, debug=True)
