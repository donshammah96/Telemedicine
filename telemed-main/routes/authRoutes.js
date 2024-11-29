import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error("Unhandled error in route:", err.message);
        console.error("Stack trace:", err.stack);
        next(err);
    });
};


// Test route
router.get('/test', (req, res) => {
    res.send('Test route is working');
});

// Route to register a new user
router.post('/register', asyncHandler(authController.registerUser));

// Route to log in a user
router.post('/login', asyncHandler(authController.loginUser));

// Route to log out a user
router.post('/logout', asyncHandler(authController.logoutUser));

export default router;