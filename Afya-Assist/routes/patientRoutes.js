import express from 'express';
import authMiddleware from '../middleware/auth.js';
import patientController from '../controllers/patientController.js';
import appointmentController from '../controllers/appointmentController.js';
import aiRoutes from './aiRoutes.js'; // Import aiRoutes

const router = express.Router();

// Helper for async error handling
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Route for patient dashboard
router.get('/patients/dashboard', asyncHandler(patientController.getDashboard));
// Routes with async controller methods
router.get('/patients', asyncHandler(patientController.getPatients));
router.get('/patient/:id', asyncHandler(patientController.getPatient));
router.post('/patient', asyncHandler(patientController.createPatient));
router.put('/patient/:id', asyncHandler(patientController.updatePatient));
router.delete('/patient/:id', asyncHandler(patientController.deletePatient));
router.get('/appointments', (req, res, next) => {
    try {
        const patient_id = req.session.userId;
        asyncHandler( appointmentController.getAppointmentsByPatient({ patient_id}, res));
    } catch (error) {
        next(error);
    }
});

// Integrate aiRoutes
router.use('/ai', aiRoutes);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        error: err,
        title: 'Error Page',
    });
});

export default router;
