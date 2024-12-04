import connection from '../middleware/db.js';
import path from 'path';

//@desc Get all ED visits
//@route GET /ed_visits
//@access Public
const getEdVisits = async (req, res, next) => {
    try {
        const edVisits = await connection.getEdVisits();
        res.status(200).render('pages/edVisits', { 
            edVisits,
            title: 'ED Visits' });
    } catch (error) {
        next(error);
    }
};

//@desc Get single ED visit
//@route GET /ed_visits/:id
//@access Public
const getEdVisit = async (req, res, next) => {
    try {
        const id = req.params.id;
        const edVisit = await connection.getEdVisitById(id);
        if (!edVisit) {
            const error = new Error(`ED visit with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('pages/edVisit', { 
            edVisit,
            title: 'ED Visit Details' });
    } catch (error) {
        next(error);
    }
};

//@desc Create new ED visit
//@route POST /ed_visits
//@access Private
const createEdVisit = async (req, res, next) => {
    try {
        const edVisit = req.body;
        if (!edVisit.patient_id || !edVisit.date || !edVisit.reason) {
            const error = new Error(`Please include patient ID, date, and reason in your request.`);
            error.status = 400;
            return next(error);
        }
        const newEdVisit = await connection.createEdVisit(edVisit);
        res.status(201).render('pages/edVisit', { 
            title: 'New ED Visit Created',
            edVisit: newEdVisit });
    } catch (error) {
        next(error);
    }
};

//@desc Update ED visit
//@route PUT /ed_visits/:id
//@access Private
const updateEdVisit = async (req, res, next) => {
    try {
        const id = req.params.id;
        const edVisit = await connection.updateEdVisit(id, req.body);
        if (!edVisit) {
            const error = new Error(`ED visit with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('pages/edVisit', { 
            title: 'ED Visit Updated',
            edVisit });
    } catch (error) {
        next(error);
    }
};

//@desc Delete ED visit
//@route DELETE /ed_visits/:id
//@access Private
const deleteEdVisit = async (req, res, next) => {
    try {
        const id = req.params.id;
        const edVisit = await connection.deleteEdVisit(id);
        if (!edVisit) {
            const error = new Error(`ED visit with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('deleteConfirmation', {
            title: 'ED Visit Deleted',
            message: 'The ED visit has been successfully deleted.',
            returnLink: 'pages/edVisits',
            entityName: 'ED Visits'
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getEdVisits,
    getEdVisit,
    createEdVisit,
    updateEdVisit,
    deleteEdVisit
};