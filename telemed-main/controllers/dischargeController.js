import connection from '../middleware/db.js';
import path from 'path';

//@desc Get all discharges
//@route GET /discharges
//@access Public
const getDischarges = async (req, res, next) => {
    try {
        const discharges = await connection.getDischarges();
        res.status(200).render('pages/discharges', { 
            title: 'Discharges',
            discharges });
    } catch (error) {
        next(error);
    }
};

//@desc Get single discharge
//@route GET /discharges/:id
//@access Public
const getDischarge = async (req, res, next) => {
    try {
        const id = req.params.id;
        const discharge = await connection.getDischargeById(id);
        if (!discharge) {
            const error = new Error(`Discharge with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('pages/discharge', {
            title: 'Discharge Details',
            discharge });
    } catch (error) {
        next(error);
    }
};

//@desc Create new discharge
//@route POST /discharges
//@access Private
const createDischarge = async (req, res, next) => {
    try {
        const discharge = req.body;
        if (!discharge.patient_id || !discharge.discharge_date || !discharge.discharge_disposition) {
            const error = new Error(`Please include patient ID, date, and disposition in your request.`);
            error.status = 400;
            return next(error);
        }
        const newDischarge = await connection.createDischarge(discharge);
        res.status(201).render('pages/discharge', { 
            title: 'New Discharge Created',
            discharge: newDischarge });
    } catch (error) {
        next(error);
    }
};

//@desc Update discharge
//@route PUT /discharges/:id
//@access Private
const updateDischarge = async (req, res, next) => {
    try {
        const id = req.params.id;
        const discharge = await connection.updateDischarge(id, req.body);
        if (!discharge) {
            const error = new Error(`Discharge with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('pages/discharge', {
            title: 'Updated Discharge Details',
            discharge: updatedDischarge,
        });
    } catch (error) {
    next(error);
};}

//@desc Delete discharge
//@route DELETE /discharges/:id
//@access Private
const deleteDischarge = async (req, res, next) => {
    try {
        const id = req.params.id;
        const discharge = await connection.deleteDischarge(id);
        if (!discharge) {
            const error = new Error(`Discharge with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('deleteConfirmation', {
            title: 'Discharge Deleted',
            message: 'The discharge record has been successfully deleted.',
            returnLink: 'pages/discharges',
            entityName: 'Discharges'
        });
        } catch (error) {
            next(error);
        }
    };

export default {
    getDischarges,
    getDischarge,
    createDischarge,
    updateDischarge,
    deleteDischarge
};