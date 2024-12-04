// aiRoutes.js

import express from 'express';
import { body, validationResult } from 'express-validator';
import aiService from '../services/aiService.js';

const router = express.Router();

// Middleware for handling validation errors
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Route for symptom checking
router.post(
    '/symptoms',
    body('symptoms').notEmpty().withMessage('Symptoms must be provided'),
    validateRequest,
    async (req, res) => {
        try {
            const conditions = await aiService.checkSymptoms(req.body.symptoms);
            if (req.xhr) {
                res.json({ conditions });
            } else {
                res.render('aiResults', { results: conditions });
            }
        } catch (error) {
            console.error("Error in /symptoms route:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

router.get(
    '/symptoms',
    async (req, res) => {
        try {
            const conditions = await aiService.checkSymptoms(req.query.symptoms);
            res.json({ conditions });
        } catch (error) {
            console.error("Error in /symptoms route:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// Route for triage
router.post(
    '/triage',
    body('symptomData').notEmpty().withMessage('Symptom data is required'),
    validateRequest,
    async (req, res) => {
        try {
            const triage = await aiService.determineTriage(req.body.symptomData);
            if (req.xhr) {
                res.json({ triage });
            } else {
                res.render('aiResults', { results: triage });
            }
        } catch (error) {
            console.error("Error in /triage route:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

router.get(
    '/triage',
    async (req, res) => {
        try {
            const triage = await aiService.determineTriage(req.query.symptomData);
            res.json({ triage });
        } catch (error) {
            console.error("Error in /triage route:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// Route for parsing symptoms from free-text
router.post(
    '/parse-symptoms',
    body('text').notEmpty().withMessage('Text must be provided'),
    validateRequest,
    async (req, res) => {
        try {
            const symptoms = await aiService.parseSymptoms(req.body.text);
            if (req.xhr) {
                res.json({ symptoms });
            } else {
                res.render('aiResults', { results: symptoms });
            }
        } catch (error) {
            console.error("Error in /parse-symptoms route:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// Route for predicting disease trends
router.post(
    '/trends',
    body('historicalData').notEmpty().withMessage('Historical data is required'),
    validateRequest,
    async (req, res) => {
        try {
            const predictions = await aiService.predictDiseaseTrends(req.body.historicalData);
            res.json({ predictions });
        } catch (error) {
            console.error("Error in /trends route:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

router.get(
    '/trends',
    async (req, res) => {
        try {
            const predictions = await aiService.predictDiseaseTrends(req.query.historicalData);
            res.json({ predictions });
        } catch (error) {
            console.error("Error in /trends route:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

export default router;
