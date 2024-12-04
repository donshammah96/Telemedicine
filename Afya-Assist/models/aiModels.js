// aiModels.js

import axios from 'axios';

const FLASK_API_BASE = process.env.FLASK_API_BASE || 'http://localhost:5000';

// Helper for API requests
const apiRequest = async (endpoint, data = {}, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.post(`${FLASK_API_BASE}/${endpoint}`, data, { timeout: 5000 });
            if (response?.data) {
                return response.data;
            } else {
                throw new Error(`Unexpected response from ${endpoint}: ${JSON.stringify(response.data)}`);
            }
        } catch (error) {
            if (attempt === retries) {
                console.error(`API request to ${endpoint} failed after ${retries} attempts:`, error.message);
                throw error;
            }
            console.warn(`Retrying API request (${attempt}/${retries}) to ${endpoint}...`);
        }
    }
};



    /*

// Uncomment this block to delegate to Flask API
const aiModels = {

    checkSymptoms: async (symptoms) => await apiRequest('symptom-check', { symptoms }),
    triage: async (symptomData) => await apiRequest('triage', symptomData),
    parseSymptoms: async (text) => await apiRequest('parse-symptoms', { text }),
    analyzeTrends: async (userData) => await apiRequest('predict', userData) 
    
    };

    */
    
    const checkSymptoms = async (symptoms) => {
        // Mock implementation data
        if (symptoms.includes('cough') && symptoms.includes('fever')) {
            return [{ condition: 'Flu' }];
        }
        return null;
    }

    const triage = async (symptomData) => {
        // Mock implementation data
        if (symptomData.symptoms.includes('cough') && symptomData.symptoms.includes('fever')) {
            return { level: 'urgent' };
        }
        return null;
    }

    const parseSymptoms = async (text) => {
        // Mock implementation data
        if (text.includes('cough') && text.includes('fever')) {
            return ['cough', 'fever'];
        }
        return null;
    }

   const analyzeTrends = async (userData) => {
        // Mock implementation data
        if (userData.data.length > 0) {
            return { trend: 'increasing' };
        }
        return null;
    }

export default {
   // aiModels,
    checkSymptoms,
    triage,
    parseSymptoms,
    analyzeTrends
};
