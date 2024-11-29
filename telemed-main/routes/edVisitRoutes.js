import express from 'express';
import authMiddleware from '../middleware/auth.js';
import edVisitController from '../controllers/edVisitController.js';

const router = express.Router();

// Middleware for authentication applied globally
router.use(authMiddleware);

// Helper for async error handling
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Route to get all ED visits
router.get('/edVisits', asyncHandler(edVisitController.getEdVisits));

// Route to get a specific ED visit by ID
router.get('/edVisit/:id', asyncHandler(edVisitController.getEdVisit));

// Route to create a new ED visit
router.post('/edVisit', asyncHandler(edVisitController.createEdVisit));

// Route to update an ED visit by ID
router.put('/edVisit/:id', asyncHandler(edVisitController.updateEdVisit));

// Route to delete an ED visit by ID
router.delete('/edVisit/:id', asyncHandler(edVisitController.deleteEdVisit));

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        error: err,
        title: 'Error Page',
    });
});

export default router;