import express from 'express';
import appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

// Helper for async error handling
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Route to get all appointments
router.get('/appointments', asyncHandler(appointmentController.getAppointments));

// Route to get upcoming appointments
router.get('/upcoming', asyncHandler(appointmentController.getUpcomingAppointments));

// Route to get a specific appointment by ID
router.get('/appointment/:id', asyncHandler(appointmentController.getAppointment));

//Route to get a specific Patient's appointments
router.get('/patient/:id', asyncHandler(appointmentController.getAppointmentsByPatient));

//Route to get a specific Doctor's appointments
router.get('/doctor/:id', asyncHandler(appointmentController.getAppointmentsByDoctor));

// Route to create a new appointment
router.post('/appointment', asyncHandler(appointmentController.createAppointment));

// Route to update an appointment by ID
router.put('/appointment/:id', asyncHandler(appointmentController.updateAppointment));

// Route to delete an appointment by ID
router.delete('/appointment/:id', asyncHandler(appointmentController.deleteAppointment));

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        error: err,
        title: 'Error Page',
    });
});

export default router;
