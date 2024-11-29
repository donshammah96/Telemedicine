import connection from '../middleware/db.js';
import path from 'path';

//@desc Get all visits
//@route GET /visits
//@access Public
const getVisits = async (req, res, next) => {
    try {
        const visits = await connection.getVisits();
        res.status(200).render('pages/visits', { 
            title: 'Visits',
            visits });
    } catch (error) {
        next(error);
    }
};

//@desc Get single visit
//@route GET /visits/:id
//@access Public
const getVisit = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const visit = await connection.getVisitById(id);
        if (!visit) {
            const error = new Error(`Visit with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('pages/visit', { 
            title: 'Visit Details',
            visit });
    } catch (error) {
        next(error);
    }
};

//@desc Create new visit
//@route POST /visits
//@access Private
const createVisit = async (req, res, next) => {
    try {
        const visit = req.body;
        if (!visit.patient_id || !visit.date_scheduled || !visit.health_center_id) {
            const error = new Error(`Please include patient ID, date, and health center ID in your request.`);
            error.status = 400;
            return next(error);
        }
        const newVisit = await connection.createVisit(visit);
        res.status(201).render('pages/visit', { 
            title: 'New Visit Created',
            visit: newVisit });
    } catch (error) {
        next(error);
    }
};

//@desc Update visit
//@route PUT /visits/:id
//@access Private
const updateVisit = async (req, res, next) => {
    try {
        const id = parseInt( req.params.id);
        const updatedVisit = await connection.updateVisit(id, req.body);
        if (!updatedVisit) {
            const error = new Error(`Visit with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('pages/visit', { 
            title: 'Visit Updated',
            visit: updatedVisit });
    } catch (error) {
        next(error);
    }
};

//@desc Delete visit
//@route DELETE /visits/:id
//@access Private
const deleteVisit = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const visit = await connection.deleteVisit(id);
        if (!visit) {
            const error = new Error(`Visit with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('deleteConfirmation', {
            title: 'Visit Deleted',
            message: 'Visit was successfully deleted',
            returnLink: 'pages/visits',
            entityName: 'Visits'
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getVisits,
    getVisit,
    createVisit,
    updateVisit,
    deleteVisit
};
