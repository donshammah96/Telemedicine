import connection from '../middleware/db.js';

// Get all patients
const getPatients = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10);
        const patients = await connection.getPatients();

        res.status(200).render('pages/patients', {
            title: 'Patients',
            patients: !isNaN(limit) && limit > 0 ? patients.slice(0, limit) : patients,
        });
    } catch (error) {
        next(error);
    }
};

// Get single patient by ID
const getPatient = async (req, res, next) => {
    try {
        const id = req.params.id;
        const patient = await connection.getPatientById(id);

        if (!patient) {
            return next({ status: 404, message: `Patient with ID ${id} not found.` });
        }

        res.status(200).render('pages/patient', {
            title: 'Patient Details',
            patient,
        });
    } catch (error) {
        next(error);
    }
};

// Create new patient
const createPatient = async (req, res, next) => {
    try {
        const { first_name, date_of_birth, illness } = req.body;

        if (!first_name || !date_of_birth || !illness) {
            return next({ status: 400, message: 'Missing required fields: first_name, date_of_birth, or illness.' });
        }

        const newPatient = await connection.createPatient(req.body);

        res.status(201).render('pages/patient', {
            title: 'New Patient Created',
            patient: newPatient,
        });
    } catch (error) {
        next(error);
    }
};

// Update existing patient
const updatePatient = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedPatient = await connection.updatePatient(id, req.body);

        if (!updatedPatient) {
            return next({ status: 404, message: `Patient with ID ${id} not found.` });
        }

        res.status(200).render('pages/patient', {
            title: 'Updated Patient Details',
            patient: updatedPatient,
        });
    } catch (error) {
        next(error);
    }
};

// Delete patient
const deletePatient = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedPatient = await connection.deletePatient(id);

        if (!deletedPatient) {
            return next({ status: 404, message: `Patient with ID ${id} not found.` });
        }

        res.status(200).render('deleteConfirmation', {
            title: 'Patient Deleted',
            message: 'The patient has been successfully deleted.',
            returnLink: 'pages/patients',
            entityName: 'Patients'
        });
    } catch (error) {
        next(error);
    }
};

//@desc GET Patient dashboard
//@route pages/patients/dashboard
//@access private
const getDashboard = async (req, res, next) => {
    try {
        const patientId = req.session.userId; // Assuming patient ID is stored in session
        const [patientRows] = await connection.query('SELECT * FROM Patients WHERE patient_id = ?', [patientId]);
        const patient = patientRows[0];

        const [appointments] = await connection.query('SELECT * FROM Appointments WHERE patient_id = ?', [patientId]);
        
        res.render('pages/patients/dashboard', { 
            patient, 
            appointments,
            title: 'Patient Dashboard'});
    } catch (error) {
        res.status(500).send('Server error');
        next(error);
    }
};

export default {
    getPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient,
    getDashboard
};
