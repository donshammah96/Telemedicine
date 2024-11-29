// Importing core packages
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import FileStore from 'session-file-store';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import http from 'http';
import helmet from 'helmet';
import crypto from 'crypto';

dotenv.config();

// Importing custom middleware and routes
import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js';
import notFound from './middleware/notFound.js';
import connection from './middleware/db.js';
import authMiddleware from './middleware/auth.js';
import indexRoutes from './routes/indexRoutes.js';
import setUserInView from './middleware/user.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import visitRoutes from './routes/visitRoutes.js';
import edVisitRoutes from './routes/edVisitRoutes.js';
import dischargeRoutes from './routes/dischargeRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import healthCenterRoutes from './routes/healthCenterRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// App initialization
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Setting up middleware
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());


const fileStore = FileStore(session);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//Middleware to generate a nonce for CSP
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('hex');
  next();
});

// Content Security Policy (CSP) configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        (req, res) => `'nonce-${res.locals.nonce}'`,
        "https://code.jquery.com",
        "https://cdnjs.cloudflare.com",
        "https://maxcdn.bootstrapcdn.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://maxcdn.bootstrapcdn.com",
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  })
);

app.use((req, res, next) => {
  console.log(`Session ID: ${req.sessionID}`);
  next();
});

app.use((err, req, res, next) => {
  if (err.status === 404) {
    console.error(`Static file not found: ${req.path}`);
    return res.status(404).send('File not found');
  }
  next(err);
});


// Serve static files
app.use(express.static(path.join(path.resolve(), 'public')));



// Log unhandled routes for debugging
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.path}`);
  next();
});

// Middleware for conditional auth
const publicRoutes = [
  '/login',
  '/register',
  '/test',
  '/pages/*',
  '/auth/login',
  '/pages/auth/login',
  '/auth/register',
  '/auth/register.ejs',
  '/pages/auth/register.ejs',
  '/auth/test',
  '/auth/logout',
  '/auth',
  '/api',
  '/logout',
  '/about',
  '/contact',
  '/',
  '/home',
  '/favicon.ico',
];

app.use((req, res, next) => {
  const isPublicRoute = publicRoutes.includes(req.path);
  const isStaticFile = req.path.match(/^\/(css|js|img|placeholder-image\.png)/);

  if (isPublicRoute || isStaticFile) {
    return next();
  }
  return authMiddleware(req, res, next);
});


// Setting up view engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'views'));
app.set('layout', 'layouts/main');

// Root routes (organized into indexRoutes)
app.use('/', indexRoutes);
app.use('/auth', authRoutes);

app.use(setUserInView);

// Grouped authenticated routes
app.use('/admins', authMiddleware, adminRoutes);
app.use('/patients', authMiddleware, patientRoutes);
app.use('/doctors', authMiddleware, doctorRoutes);
app.use('/appointments', authMiddleware, appointmentRoutes);
app.use('/visits', authMiddleware, visitRoutes);
app.use('/ed_visits', authMiddleware, edVisitRoutes);
app.use('/discharges', authMiddleware, dischargeRoutes);
app.use('/admissions', authMiddleware, admissionRoutes);
app.use('/health_centers', authMiddleware, healthCenterRoutes);
app.use('/chat', authMiddleware, chatRoutes);

app.get('/chat', authMiddleware, (req, res) => {
  const user = req.user; // Assume user details are fetched from authentication middleware
  const chatPartner = req.query.partner; // Get the chat partner ID (doctor or patient)
  const isDoctor = user.role === 'doctor';
  const isPatient = user.role === 'patient';
  const isAdmin = user.role === 'admin';

  res.render('chat', {
    user,
    partner: chatPartner,
    isDoctor,
    isPatient,
    isAdmin,
  });
});

// Catch-all and error handling middleware
app.use(notFound);
app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error(err.stack || err.message);
  res.status(500).render('error', { message: 'Internal server error' });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected.');

  // Join a specific room
  socket.on('joinRoom', ({ room }) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Chat message handler
  socket.on('chatMessage', async ({ room, sender, message }, callback) => {
    try {
      await connection.query('INSERT INTO chat_messages (room, sender, message) VALUES (?, ?, ?)', [room, sender, message]);
      io.to(room).emit('chatMessage', { sender, message });
      callback({ status: 'success' });
    } catch (error) {
      console.error('Failed to save chat:', error);
      callback({ status: 'error', error: 'Message saving failed' });
    }
  });

  // Typing event
  socket.on('typing', ({ room, sender }) => {
    socket.to(room).emit('typing', { sender });
  });

  // Stop typing event
  socket.on('stopTyping', ({ room, sender }) => {
    socket.to(room).emit('stopTyping', { sender });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected.');
  });
});

export default app;
