import express from 'express';
const router = express.Router();

// Helper for async error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error("Unhandled error in route:", err.message);
      console.error("Stack trace:", err.stack);
      next(err);
  });
};


// Define routes
router.get('/', asyncHandler((req, res) => res.render('pages/home', { title: 'Home', message: 'Welcome to TeleMed - Your Healthcare Anywhere!' })));
router.get('/home', asyncHandler((req, res) => res.render('pages/home', { title: 'Home', message: 'Welcome to TeleMed - Your Healthcare Anywhere!' })));
router.get('/about', asyncHandler((req, res) => res.render('pages/about', { title: 'About' })));
router.get('/contact', asyncHandler((req, res) => res.render('pages/contact', { title: 'Contact' })));
router.get('/login', asyncHandler((req, res) => res.render('pages/login', { title: 'Login' })));
router.get('/register', (req, res) => {
  res.render('pages/register',  { title: 'Register', error: null, formData: {} });
});

export default router;