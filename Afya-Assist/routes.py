
from flask import Blueprint, request, jsonify, abort
from marshmallow import Schema, fields, ValidationError
import structlog
import requests
import os

# Initialize structured logging
logger = structlog.get_logger()

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
    # Define fields as per the expected payload structure
    pass

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

# Create blueprints
symptom_check_bp = Blueprint('symptom_check', __name__)
triage_bp = Blueprint('triage', __name__)

@symptom_check_bp.route('/symptom-check', methods=['POST'])
def symptom_check():
    """
    Endpoint to perform a symptom check using the Infermedica API.

    Expects a JSON payload with an 'evidence' field containing the symptoms.

    Returns:
        Response: A JSON response with the diagnosis results or an error message.
    """
    try:
        payload = symptom_check_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400
    return jsonify(forward_request("diagnosis", payload))

@triage_bp.route('/triage', methods=['POST'])
def triage():
    """
    Endpoint to perform a triage check using the Infermedica API.

    Expects a JSON payload.

    Returns:
        Response: A JSON response with the triage results or an error message.
    """
    try:
        payload = triage_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400
    return jsonify(forward_request("triage", payload))