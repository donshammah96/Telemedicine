import express from 'express';
import authMiddleware from '../middleware/auth.js';
import dischargeController from '../controllers/dischargeController.js';

const router = express.Router();

// Helper for async error handling
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Route to get all discharges
router.get('/discharges/', asyncHandler(dischargeController.getDischarges));

// Route to get a specific discharge by ID
router.get('/discharge/:id', asyncHandler(dischargeController.getDischarge));

// Route to create a new discharge
router.post('/discharge/', asyncHandler(dischargeController.createDischarge));

// Route to update a discharge by ID
router.put('/discharge/:id', asyncHandler(dischargeController.updateDischarge));

// Route to delete a discharge by ID
router.delete('/discharge/:id', asyncHandler(dischargeController.deleteDischarge));

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        error: err,
        title: 'Error Page',
    });
});

export default router;