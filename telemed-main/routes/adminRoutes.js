import express from 'express';
import adminControllers from '../controllers/adminControllers.js';
import authMiddleware from '../middleware/auth.js';
import appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

// Apply authentication middleware globally
router.use(authMiddleware);

// Helper for async error handling
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Route to get all admins
router.get('/admins/', asyncHandler(adminControllers.getAdmins));

// Route to get a specific admin by ID
router.get('/admin/:id', asyncHandler(adminControllers.getAdmin));

// Route to create a new admin
router.post('/admin/', asyncHandler(adminControllers.createAdmin));

// Route to update an admin by ID
router.put('/admin/:id', asyncHandler(adminControllers.updateAdmin));

// Route to delete an admin by ID
router.delete('/admin/:id', asyncHandler(adminControllers.deleteAdmin));

// Route to admin dashboard
router.get('admins/dashboard', asyncHandler(adminControllers.getDashboard));

//Route to admin profile
router.post('/profile', asyncHandler(adminControllers.updateProfile));

//Route to create appointments
router.post('appointments', asyncHandler(appointmentController.getAppointments));


// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        error: err,
        title: 'Error Page',
    });
});

export default router;