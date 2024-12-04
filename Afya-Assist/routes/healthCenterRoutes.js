import express from 'express';
import healthCenterController from '../controllers/healthCenterController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Helper for async error handling
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

//@route GET /health-centers
//@desc Get all health centers
//@access Public
router.get('/healthCenters', asyncHandler(healthCenterController.getHealthCenters));

//@route GET /health-centers/:id
//@desc Get single health center
//@access Public
router.get('/healthCenter/:id', asyncHandler(healthCenterController.getHealthCenter));

//@route POST /health-centers
//@desc Create new health center
//@access Private
router.post('/healthCenter', asyncHandler(healthCenterController.createHealthCenter));

//@route PUT /health-centers/:id
//@desc Update health center
//@access Private
router.put('/healthCenter/:id', asyncHandler(healthCenterController.updateHealthCenter));

//@route DELETE /health-centers/:id
//@desc Delete health center
//@access Private
router.delete('/healthCenter/:id', asyncHandler(healthCenterController.deleteHealthCenter));

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        error: err,
        title: 'Error Page',
    });
});

export default router;