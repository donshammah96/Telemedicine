import axios from 'axios';
import dotenv from 'dotenv';
import aiModels from '../models/aiModels.js';

dotenv.config();

const apiUrl = process.env.INTERMEDICA_API_URL;
const apiKey = process.env.INTERMEDICA_API_KEY;

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: { 
    Authorization: `Bearer ${apiKey}` 
  },
  timeout: 5000, // Add a timeout to handle delays
});

// Symptom Checker
const checkSymptoms = async (symptoms) => {
    try {
        const conditions = await aiModels.checkSymptoms(symptoms);
        if (!conditions || !Array.isArray(conditions)) {
            throw new Error("Invalid conditions structure");
        }
        return conditions;
    } catch (error) {
        console.error("Error in checkSymptoms service:", error.message);
        throw new Error("Failed to analyze symptoms.");
    }
};

// Triage System
const determineTriage = async (symptomData) => {
    try {
        const triage = await aiModels.triage(symptomData);
        if (!triage || typeof triage !== 'object') {
            throw new Error("Invalid triage structure");
        }
        return triage;
    } catch (error) {
        console.error("Error in determineTriage service:", error.message);
        throw new Error("Failed to determine triage level.");
    }
};

// Parse symptoms from free-text
const parseSymptoms = async (text) => {
    try {
        const symptoms = await aiModels.parseSymptoms(text);
        if (!symptoms || !Array.isArray(symptoms)) {
            throw new Error("Invalid symptoms structure");
        }
        return symptoms;
    } catch (error) {
        console.error("Error in parseSymptoms service:", error.message);
        throw new Error("Failed to parse symptoms.");
    }
};

// Predict disease trends
const predictDiseaseTrends = async (historicalData) => {
    try {
        const predictions = await aiModels.analyzeTrends(historicalData);
        if (!predictions || typeof predictions !== 'object') {
            throw new Error("Invalid predictions structure");
        }
        return predictions;
    } catch (error) {
        console.error("Error in predictDiseaseTrends service:", error.message);
        throw new Error("Failed to predict disease trends.");
    }
};

export default {
    checkSymptoms,
    determineTriage,
    parseSymptoms,
    predictDiseaseTrends
};