import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import unless from 'express-unless';
dotenv.config();

const authMiddleware = (req, res, next) => {
    // Define public routes that do not require authentication
    const publicRoutes = ['/login', '/register', '/logout', '/about', '/contact', '/', '/public/*', '/favicon.ico'];

    // Allow requests to public routes to bypass authentication
    if (publicRoutes.includes(req.path)) {
        return next();
    }

    // Check for Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).render('error', { message: 'Unauthorized access. Please log in to continue.' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Attach user ID to the request object
        next();
    } catch (error) {
        // Handle invalid or expired token
        return res.status(401).render('error', { message: 'Unauthorized access. Please log in to continue.' });
    }
};

// Apply `unless` to authMiddleware
authMiddleware.unless = unless;

export default authMiddleware;
