import connection from '../middleware/db.js';

//@desc Get all admins
//@route GET /admins
//@access Private
const getAdmins = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10);
        const admins = await connection.getAdministrators();
        res.status(200).render('pages/admins', { 
            title: 'Administrators',
            admins: !isNaN(limit) && limit > 0 ? admins.slice(0, limit) : admins});
    } catch (error) {
        next(error);
    }
};

//@desc Get single admin
//@route GET /admins/:id
//@access Private
const getAdmin = async (req, res, next) => {
    try {
        const id = req.params.id;
        const admin = await connection.getAdministratorById(id);
        if (!admin) {
            const error = new Error(`Admin with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('pages/admin/admin', {
            title: 'Administrator Details',
            admin,
        });
    } catch (error) {
        next(error);
    }
};

//@desc Create new admin
//@route POST /admins
//@access Private
const createAdmin = async (req, res, next) => {
    try {
        const admin = req.body;
        if (!first_name || !doctor_speciality || !doctor_availability) {
            return next({ status: 400, message: 'Missing required fields: first_name, doctor_speciality, or doctor_availability.' });
        }
        const newAdmin = await connection.createAdministrator(admin);
        res.status(201).render('pages/admin', { 
            title: 'New Admin Created',
            admin: newAdmin });
    } catch (error) {
        next(error);
    }
};

//@desc Update admin
//@route PUT /admins/:id
//@access Private
const updateAdmin = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedAdmin = await connection.updateAdministrator(id, req.body);
        if (!updatedAdmin) {
            const error = new Error(`Admin with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('pages/admin', { 
            title: 'Admin Updated',
            admin: updatedAdmin });
    } catch (error) {
        next(error);
    }
};

//@desc Delete admin
//@route DELETE /admins/:id
//@access Private
const deleteAdmin = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedAdmin = await connection.deleteAdministrator(id);
        if (!deletedAdmin) {
            const error = new Error(`Admin with ID ${id} not found.`);
            error.status = 404;
            return next(error);
        }
        res.status(200).render('deleteConfirmation', {
            title: 'Admin Deleted',
            message: 'The admin has been successfully deleted.',
            returnLink: 'pages/admins',
            entityName: 'Admins'
        });
    } catch (error) {
        next(error);
    }
};

//@desc GET Admin dashboard
//@route pages/admin/dashboard
//@access private
const getDashboard = async (req, res, next) => {
    try {
        const [appointments] = await connection.query('SELECT * FROM Appointments');
        res.render('pages/admin/dashboard', { 
            appointments });
    } catch (error) {
        req.status(500).send('Server error');
        next(error);
    }

};

//@desc  Admin profile
//@route  pages/admin/dashboard
//@access private 
const updateProfile = async (req, res, next) => {
    const {first_name, last_name, role} = req.body;
    try {
        await connection.query('UPDATE administrators SET first_name = ?, last_name = ? , role = ? WHERE admin_id = ?', [first_name, last_name, role, 1 ]);
        res.redirect('pages/admin/dashboard');
    } catch (error) {
        next(error);
        res.status(500).send('Error updating profile');
    }
};

const createAppointment = async ( req, res, next) => {
    const { patient_id, doctor_id, appointment_date } = req.body;
    try {
        await connection.query('INSERT INTO Appointments (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)', [patient_id, doctor_id, appointment_date]);
        res.redirect('pages/admin/dashboard');
    } catch (error) {
        next(error);
        res.status(500).send('Error creating appointment');
    }
};

export default {
    getAdmins,
    getAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin, 
    getDashboard,
    updateProfile,
    createAppointment
};