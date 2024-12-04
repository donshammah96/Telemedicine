import connection from '../middleware/db.js';
import path from 'path';
import express from 'express';
import { title } from 'process';

//@desc Get all appointments
//@route GET /appointments
//@access Public
const getAppointments = async (req, res, next) => {
    try {
        const limit = req.query.limit;
        const appointments = await connection.getAppointments(limit);

        if (!isNaN(limit) && limit > 0) {
            return res.status(200).render('pages/appointments', { appointments: appointments.slice(0, limit) });
        }
        res.status(200).render('appointments', { 
            title: 'Appointments',
            appointments });
    } catch (error) {
        next(error);
    }
};

//@desc GET all upcoming appointments
const getUpcomingAppointments = async (req, res, next) => {
    const { doctorId } = req.query; // Pass doctor ID dynamically
    try {
        const [rows] = await connection.query(
            'SELECT id, patient_first_name, date, time, location FROM appointments WHERE doctor_id = ? AND date >= CURDATE() ORDER BY date ASC, time ASC',
            [doctorId]
        );
        res.json(rows);
    } catch (error) {
        next(error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
};

//@desc Get single appointment
//@route GET /appointments/:id
//@access Public
const getAppointment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const appointment = await connection.getAppointmentById(id);
        if (!appointment) {
            const error = new Error(`Appointment with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('pages/appointment', { 
            title: 'Appointment Details',
            appointment });
    } catch (error) {
        next(error);
    }
};

//@desc Create new appointment
//@route POST /appointments
//@access Private
const createAppointment = async (req, res, next) => {
    try {
        const appointment = req.body;
        if (!appointment.patient_id || !appointment.doctor_id || !appointment.appointment_date) {
            const error = new Error(`Please include patientId, doctorId, and date in your request.`);
            error.status = 400;
            return next(error);
        }
        const newAppointment = await connection.createAppointment(appointment);
        res.status(201).render('pages/appointment', { 
            title: 'New Appointment Created',
            appointment: newAppointment });
    } catch (error) {
        next(error);
    }
}

//@desc Update appointment
//@route PUT /appointments/:id
//@access Private
const updateAppointment = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const updatedAppointment = await connection.updateAppointment(id, req.body);
        if (!updatedAppointment) {
            const error = new Error(`Appointment with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('pages/appointment', { 
            title: 'Appointment Updated',
            appointment: updatedAppointment });
    } catch (error) {
        next(error);
    }
}

//@desc Delete appointment
//@route DELETE /appointments/:id
//@access Private
const deleteAppointment = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const deletedAppointment = await connection.deleteAppointment(id);
        if (!deletedAppointment) {
            const error = new Error(`Appointment with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('deleteConfirmation', {
            title: 'Appointment Deleted',
            message: 'The appointment has been successfully deleted.',
            returnLink: 'pages/appointments',
            entityName: 'Appointments'
        });
    } catch (error) {
        next(error);
    }
}

//@desc FETCH appointments for a specific patient
const getAppointmentsByPatient = async (req, res, next) => {
    const patient_id = parseInt(req.params.id);
    try {
        const [appointments] = await connection.query('SELECT * FROM Appointments WHERE patient_id = ?', [patient_id]);
        res.status(200).render('pages/patients/appointments', {
            title: `Appointment for Patient ID: ${patient_id}`,
            appointments
        });
    } catch (error) {
        next(error);
    }
};

//@desc FETCH appointments for a specific doctor
const getAppointmentsByDoctor = async (req, res, next) => {
    const doctor_id = parseInt(req.params.id);
    try {
        const [appointments] = await connection.query('SELECT * FROM Appointments WHERE doctor_id = ?', [doctor_id]);
        res.status(200).render('pages/doctors/appointments', {
            title: `Appointment for Doctor ID: ${doctor_id}`,
            appointments
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByPatient,
    getAppointmentsByDoctor,
    getUpcomingAppointments
};
