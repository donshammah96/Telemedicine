import express from 'express';
import chatController from '../controllers/chatController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Helper for async error handling
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Routes with async controller method
router.get('/history/:room', asyncHandler(chatController.getChatHistory));
router.post('/send', asyncHandler(chatController.sendMessage));
router.delete('/delete/:messageId', asyncHandler(chatController.deleteMessage));
router.post('/mark-as-read', asyncHandler(chatController.markAsRead));
router.get('/search/:room', asyncHandler(chatController.searchMessages));
router.get('/unread/:room/:reader', asyncHandler(chatController.getUnreadCount));

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default router;