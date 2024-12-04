import express from 'express';
import authMiddleware from '../middleware/auth.js';
import doctorController from '../controllers/doctorController.js';
import appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

// Helper for async error handling
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Route to doctor dashboard
router.get('/doctors/dashboard', asyncHandler(doctorController.getDashboard));

// Route to get all doctors
router.get('/doctors', asyncHandler(doctorController.getDoctors));

// Route to get a specific doctor by ID
router.get('/doctor/:id', asyncHandler(doctorController.getDoctor));

// Route to create a new doctor
router.post('/doctor', asyncHandler(doctorController.createDoctor));

// Route to update a doctor by ID
router.put('/doctor/:id', asyncHandler(doctorController.updateDoctor));

// Route to delete a doctor by ID
router.delete('/doctor/:id', asyncHandler(doctorController.deleteDoctor));

// Route to get appointments by doctor_id
router.get('/appointments', asyncHandler(async (req, res, next) => {
    const doctor_id = req.session.userId;
    await appointmentController.getAppointmentsByDoctor({ doctor_id }, res);
}));

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        error: err,
        title: 'Error Page',
    });
});

export default router;
