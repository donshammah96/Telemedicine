import connection from '../middleware/db.js';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

// Whitelist of tables
const tables = {
    patient: 'patients',
    doctor: 'doctors',
    admin: 'administrators'
};

// Validation schema
const userSchema = Joi.object({
    first_name: Joi.string().min(2).required(),
    last_name: Joi.string().min(2).required(),
    email_address: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone_number: Joi.string().pattern(/^\d{10}$/).required(),
    date_of_birth: Joi.date().less('now').required(),
    address: Joi.string().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    userType: Joi.string().valid('patient', 'doctor', 'admin').required(),
    doctor_speciality: Joi.string().when('userType', { is: 'doctor', then: Joi.required() }),
    doctor_availability: Joi.string().when('userType', { is: 'doctor', then: Joi.required() }),
    date_joined: Joi.date().when('userType', { is: Joi.valid('doctor', 'admin'), then: Joi.required() }),
    role: Joi.string().when('userType', { is: 'admin', then: Joi.required() }),
    language: Joi.string().when('userType', { is: 'patient', then: Joi.required() })
});

const hashPassword = async (password) => await bcrypt.hash(password, 10);
const comparePassword = async (password, hash) => await bcrypt.compare(password, hash);

// Define the validateTable function
const validateTable = (userType) => {
    return tables[userType] || null;
};

const registerUser = async (req, res, next) => {

    if (!connection) {
        console.error("Database connection is not available");
        return res.status(500).render('error', { message: 'Internal server error' });
    }
    
    console.log('Incoming data:', req.body);

    const password = (req.body.password || req.body.password_hash || '').trim();
    const confirm_password = (req.body.confirm_password || '').trim();

    console.log(`Password: ${password}`);
    console.log(`Confirm Password: ${confirm_password}`);

    if (password !== confirm_password) {
        return res.status(400).render('error', { message: 'Passwords do not match' });
    }

    if (req.body.terms !== 'on') {
        return res.status(400).render('error', { message: 'You must agree to the terms and conditions' });
    }

    const { confirm_password: _, terms, ...userData } = req.body;

    const { error } = userSchema.validate(userData);
    if (error) {
        console.error('Validation error:', error.details[0].message);
        return res.status(400).render('error', { message: error.details[0].message });
    }

    try {
        const { first_name, last_name, email_address, phone, date_of_birth, address, gender, userType, doctor_speciality, doctor_availability, date_joined, role, language } = userData;

        const table = validateTable(userType);
        
        if (!table) {
            console.error("User type did not resolve to a valid table:", userType);
            return res.status(400).render("error", { message: "Invalid user type provided." });
        }

        console.log("Resolved table name:", table);

        // Safer option: Hardcode table if known
        const validate = `SELECT * FROM ${table} WHERE email_address = ?`;

        console.log("Executing query:", validate);
        console.log("Parameters:", [email_address]);

        const [rows] = await connection.query(validate, [email_address]);

        if (rows.length > 0) {
            return res.status(400).render("error", { message: "User already exists" });
        }

        console.log("No existing user found. Proceeding with registration.");

        const userId = uuidv4();
        const password_hash = await hashPassword(password);

        const fields = ['id', 'first_name', 'last_name', 'email_address', 'password_hash', 'phone', 'date_of_birth', 'address', 'gender', 'language'];
        const values = [userId, first_name, last_name, email_address, password_hash, phone, date_of_birth, address, gender, language];

        if (userType === 'doctor') {
            fields.push('doctor_speciality', 'doctor_availability', 'date_joined');
            values.push(doctor_speciality, doctor_availability, date_joined);
        } else if (userType === 'admin') {
            fields.push('date_joined', 'role');
            values.push(date_joined, role);
        }

        console.log("Prepared fields:", fields);
        console.log("Prepared values:", values);

        const query = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;

        console.log("Executing INSERT query:", query);
        await connection.query(query, values);

        console.log('Validation schema result:', { error, value: userData });

        console.log("User registration successful.");

        res.status(201).render('success', { message: 'User registered successfully', redirect: 'pages/login' });

    } catch (error) {
        console.error("Unexpected error during registration:", error);
        res.status(500).render('error', { message: 'An internal server error occurred.' });
    }
};


// User login logic
const loginUser = async (req, res, next) => {
    const { email_address, password, userType } = req.body;

    try {
        const table = validateTable(userType);
        if (!table) {
            return res.status(400).render('error', { message: 'Invalid user type' });
        }

        const [rows] = await connection.query(`SELECT * FROM ${table} WHERE email_address = ?`, [email_address]);

        if (rows.length === 0) {
            return res.status(401).render('error', { message: 'Invalid email or password' });
        }

        const user = rows[0];
        const isMatch = await comparePassword(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).render('error', { message: 'Invalid email or password' });
        }

        req.session.userId = user.id;
        req.session.user = { id: user.id, role: userType };

        const redirects = {
            patient: 'pages/patients/dashboard',
            doctor: 'pages/doctors/dashboard',
            admin: 'pages/admin/dashboard',
        };

        res.status(200).render('success', { message: 'Login successful', redirect: redirects[userType] });
    } catch (error) {
        next(new Error('Failed to login user'));

    }
};

// User logout logic
const logoutUser = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).render('error', { message: error.message });
        }
        res.status(200).render('success', { message: 'Logout successful', redirect: 'pages/login' });
    });
};

export default { 
    registerUser, 
    loginUser, 
    logoutUser 
};