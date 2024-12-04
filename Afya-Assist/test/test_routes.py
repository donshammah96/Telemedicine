
import unittest
from flask import Flask
from routes import symptom_check_bp, triage_bp

class RoutesTestCase(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(symptom_check_bp)
        self.app.register_blueprint(triage_bp)
        self.client = self.app.test_client()

    def test_symptom_check_valid(self):
        response = self.client.post('/symptom-check', json={"evidence": [{"id": "s_21", "choice_id": "present"}]})
        self.assertEqual(response.status_code, 200)

    def test_symptom_check_invalid(self):
        response = self.client.post('/symptom-check', json={})
        self.assertEqual(response.status_code, 400)

    def test_triage_valid(self):
        response = self.client.post('/triage', json={"evidence": [{"id": "s_21", "choice_id": "present"}]})
        self.assertEqual(response.status_code, 200)

    def test_triage_invalid(self):
        response = self.client.post('/triage', json={})
        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()