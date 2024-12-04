import connection from '../middleware/db.js';
import path from 'path';

//@desc Get all admissions
//@route GET /admissions
//@access Public
const getAdmissions = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10);
        const admissions = await connection.getAdmissions();
        res.status(200).render('pages/admissions', { 
            title: 'Admissions',
            admissions: !isNaN(limit) && limit > 0 ? admissions.slice(0, limit) : admissions});
    } catch (error) {
        next(error);
    }
};

//@desc Get single admission
//@route GET /admissions/:id
//@access Public
const getAdmission = async (req, res, next) => {
    try {
        const id = req.params.id;
        const admission = await connection.getAdmissionById(id);
        if (!admission) {
            const error = new Error(`Admission with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('pages/admission', { 
            title: 'Admission Details',
            admission });
    } catch (error) {
        next(error);
    }
};

//@desc Create new admission
//@route POST /admissions
//@access Private
const createAdmission = async (req, res, next) => {
    try {
        const admission = req.body;
        if (!admission.admission_date || !admission.primary_diagnosis || !admission.service) {
            const error = new Error(`Please include Admission date, diagnosis, and service in your request.`);
            error.status = 400;
            return next(error);
        }
        const newAdmission = await connection.createAdmission(admission);
        res.status(201).render('pages/admission', { 
            title: 'New Admission Created',
            admission: newAdmission });
    } catch (error) {
        next(error);
    }
};

//@desc Update admission
//@route PUT /admissions/:id
//@access Private
const updateAdmission = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const updatedAdmission = await connection.updateAdmission(id, req.body);
        if (!updatedAdmission) {
            const error = new Error(`Admission with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('pages/admission', { 
            title: 'Admission Updated',
            admission: updatedAdmission });
    } catch (error) {
        next(error);
    }
};

//@desc Delete admission
//@route DELETE /admissions/:id
//@access Private
const deleteAdmission = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const deletedAdmission = await connection.deleteAdmission(id);
        if (!deletedAdmission) {
            const error = new Error(`Admission with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('deleteConfirmation', {
            title: 'Admission Deleted',
            message: 'The admission has been successfully deleted.',
            returnLink: 'pages/admissions',
            entityName: 'Admissions'
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getAdmissions,
    getAdmission,
    createAdmission,
    updateAdmission,
    deleteAdmission
};