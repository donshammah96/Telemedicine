import express from 'express';
import authMiddleware from '../middleware/auth.js';
import visitController from '../controllers/visitController.js';

const router = express.Router();

// Helper for async error handling
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Route to get all visits
router.get('/visits', asyncHandler(visitController.getVisits));

// Route to get a specific visit by ID
router.get('/visit/:id', asyncHandler(visitController.getVisit));

// Route to create a new visit
router.post('/visit', asyncHandler(visitController.createVisit));

// Route to update a visit by ID
router.put('/visit/:id', asyncHandler(visitController.updateVisit));

// Route to delete a visit by ID
router.delete('/visit/:id', asyncHandler(visitController.deleteVisit));

//Error handling middleware
router.use((err, req, re, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        error: err,
        title: 'Error Page',
    });
});

export default router;