import connection from '../middleware/db.js';
import path from 'path';

//@desc Get all health centers
//@route GET /health-centers
//@access Public
const getHealthCenters = async (req, res, next) => {
    try {
        const healthCenters = await connection.getHealthCenters();
        res.status(200).render('pages/healthCenters', { 
            title: 'Health Centers', 
            healthCenters });
    } catch (error) {
        next(error);
    }
};

//@desc Get single health center
//@route GET /health-centers/:id
//@access Public
const getHealthCenter = async (req, res, next) => {
    try {
        const id = req.params.id;
        const healthCenter = await connection.getHealthCenterById(id);
        if (!healthCenter) {
            const error = new Error(`Health center with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('pages/healthCenter', { 
            title: 'Health Center Details',
            healthCenter });
    } catch (error) {
        next(error);
    }
};

//@desc Create new health center
//@route POST /health-centers
//@access Private
const createHealthCenter = async (req, res, next) => {
    try {
        const healthCenter = req.body;
        if (!healthCenter.name || !healthCenter.location) {
            const error = new Error(`Please include name and location in your request.`);
            error.status = 400;
            return next(error);
        }
        const newHealthCenter = await connection.createHealthCenter(healthCenter);
        res.status(201).render('pages/healthCenter', { 
            title: 'New Health Center Created',
            healthCenter: newHealthCenter });
    } catch (error) {
        next(error);
    }
};

//@desc Update health center
//@route PUT /health-centers/:id
//@access Private
const updateHealthCenter = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedHealthCenter = await connection.updateHealthCenter(id, req.body);
        if (!updatedHealthCenter) {
            const error = new Error(`Health center with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('pages/healthCenter', { 
            title: 'Health Center Updated',
            healthCenter: updatedHealthCenter });
    } catch (error) {
        next(error);
    }
};

//@desc Delete health center
//@route DELETE /health-centers/:id
//@access Private
const deleteHealthCenter = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedHealthCenter = await connection.deleteHealthCenter(id);
        if (!deletedHealthCenter) {
            const error = new Error(`Health center with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('deleteConfirmation', {
            title: 'Health Center Deleted',
            message: 'The health center has been successfully deleted.',
            returnLink: 'pages/healthCenters',
            entityName: 'Health Centers'
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getHealthCenters,
    getHealthCenter,
    createHealthCenter,
    updateHealthCenter,
    deleteHealthCenter
};