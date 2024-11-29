import express from 'express';
import authMiddleware from '../middleware/auth.js';
import admissionController from '../controllers/admissionController.js';

const router = express.Router();

// Apply authentication middleware globally
router.use(authMiddleware);

// Helper for async error handling
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Route to get all admissions
router.get('/admissions/', asyncHandler(admissionController.getAdmissions));

// Route to get a specific admission by ID
router.get('/admission/:id', asyncHandler(admissionController.getAdmission));

// Route to create a new admission
router.post('/admission/', asyncHandler( admissionController.createAdmission));

// Route to update an admission by ID
router.put('/admission/:id', asyncHandler(admissionController.updateAdmission));

// Route to delete an admission by ID
router.delete('/admission/:id', asyncHandler(admissionController.deleteAdmission));

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        error: err,
        title: 'Error Page',
    });
});

export default router;