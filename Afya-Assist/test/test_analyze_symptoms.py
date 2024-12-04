
import unittest
from ..analyze_symptoms import analyze_symptoms
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../python')))

class AnalyzeSymptomsTestCase(unittest.TestCase):
    def test_analyze_symptoms_fever(self):
        result = analyze_symptoms("I have a fever")
        self.assertIn("Flu", result)
        self.assertIn("Common Cold", result)
        self.assertIn("COVID-19", result)

    def test_analyze_symptoms_cough(self):
        result = analyze_symptoms("I have a cough")
        self.assertIn("Common Cold", result)
        self.assertIn("Bronchitis", result)
        self.assertIn("COVID-19", result)

    def test_analyze_symptoms_headache(self):
        result = analyze_symptoms("I have a headache")
        self.assertIn("Migraine", result)
        self.assertIn("Tension Headache", result)
        self.assertIn("Cluster Headache", result)

if __name__ == '__main__':
    unittest.main()