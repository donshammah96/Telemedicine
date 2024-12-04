import connection from '../middleware/db.js';
import path from 'path';

//@desc Get all doctors
//@route GET /doctors
//@access Public
const getDoctors = async (req, res, next) => {
    try {
        const limit = req.query.limit;
        const doctors = await connection.getDoctors(limit);

        if (!isNaN(limit) && limit > 0) {
            return res.status(200).render('pages/doctors', { doctors: doctors.slice(0, limit) });
        }
        res.status(200).render('pages/doctors', { 
            title: 'Doctors',
            doctors 
        });
    } catch (error) {
        next(error);
    }
};

//@desc Get single doctor
//@route GET /doctors/:id
//@access Public
const getDoctor = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const doctor = await connection.getDoctorById(id);
        if (!doctor) {
            const error = new Error(`Doctor with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('pages/doctor', { 
            title: 'Doctor Details',
            doctor });
    } catch (error) {
        next(error);
    }
};

//@desc Create new doctor
//@route POST /doctors
//@access Private
const createDoctor = async (req, res, next) => {
    try {
        const doctor = req.body;
        if (!doctor.first_name || !doctor.doctor_specialty) {
            const error = new Error(`Please include name and specialty in your request.`);
            error.status = 400;
            return next(error);
        }
        const newDoctor = await connection.createDoctor(doctor);
        res.status(201).render('pages/doctor', { 
            title: 'New Doctor Created',
            doctor: newDoctor });
    } catch (error) {
        next(error);
    }
};

//@desc Update doctor
//@route PUT /doctors/:id
//@access Private
const updateDoctor = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const doctor = req.body;
        const doctors = await connection.getDoctors();
        const doctorIndex = doctors.findIndex(doctor => doctor.id === id);
        if (doctorIndex === -1) {
            const error = new Error(`Doctor with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        if (!doctor.first_name || !doctor.doctor_specialty) {
            const error = new Error(`Please include name and specialty in your request.`);
            error.status = 400;
            return next(error);
        }
        const updatedDoctor = await connection.updateDoctor(id, doctor);
        res.status(200).render('pages/doctor', { 
            title: 'Doctor Updated',
            doctor: updatedDoctor });

    } catch (error) {
        next(error);
    }
};

//@desc Delete doctor
//@route DELETE /doctors/:id
//@access Private
const deleteDoctor = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const doctors = await connection.getDoctors();
        const doctorIndex = doctors.findIndex(doctor => doctor.id === id);
        if (doctorIndex === -1) {
            const error = new Error(`Doctor with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        await connection.deleteDoctor(id);
        res.status(200).render('deleteConfirmation', {
            title : 'Doctor Deleted',
            message: 'The doctor has been successfully deleted',
            returnLink: 'pages/doctors',
            entityName: 'Doctors'
        });
    } catch (error) {
        next(error);
    }
};

const getDashboard = async (req, res, next) => {
    try {
        const doctorID = req.session.userId;
        const [doctorRows] = await connection.query('SELECT * FROM Doctors WHERE doctor_id = ?', [doctorID]);
        const doctor = doctorRows[0];

        const [appointments] = await connection.query('SELECT * FROM Appointments WHERE doctor_id = ?', [doctorID]);

        res.render('pages/doctors/dashboard', { 
            doctor, 
            appointments,
            title: 'Doctor Dashboard'});
    } catch (error) {
        res.status(500).send('Server error');
        next(error);
    }
};

const createAppointment = async ( req, res, next) => {
    const { patient_id, doctor_id, appointment_date } = req.body;
    try {
        await connection.query('INSERT INTO Appointments (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)', [patient_id, doctor_id, appointment_date]);
        res.redirect('pages/doctors/dashboard');
    } catch (error) {
        next(error);
        res.status(500).send('Error creating appointment');
    }
};

export default {
    getDoctors,
    getDoctor,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getDashboard,
    createAppointment
};
