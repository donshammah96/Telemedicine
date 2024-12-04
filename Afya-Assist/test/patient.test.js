import request from 'supertest';
import * as chai from 'chai';
import app from '../index.js';
import patientController from '../controllers/patientController.js';
import appointmentController from '../controllers/appointmentController.js';
import patientRoutes from '../routes/patientRoutes.js';
import jest from 'jest-mock';

const { expect } = chai;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', patientRoutes);

jest.mock('../controllers/patientController.js');
jest.mock('../controllers/appointmentController.js');

describe('Patient Tests', () => {
    it('should get patient dashboard', async () => {
        patientController.getDashboard.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).get('/patients/dashboard');
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({});
    });

    it('should get all patients', async () => {
        patientController.getPatients.mockImplementation((req, res) => res.status(200).json([]));
        const res = await request(app).get('/patients');
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal([]);
    });

    it('should get a specific patient by ID', async () => {
        const patient = { id: 'gx12hhat3', name: 'Patient gx12hhat3' };
        patientController.getPatient.mockImplementation((req, res) => res.status(200).json(patient));
        const res = await request(app).get('/patient/gx12hhat3');
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(patient);
    });

    it('should create a new patient', async () => {
        const newPatient = { name: 'New Patient' };
        patientController.createPatient.mockImplementation((req, res) => res.status(201).json(newPatient));
        const res = await request(app).post('/patient').send(newPatient);
        expect(res.status).to.equal(201);
        expect(res.body).to.deep.equal(newPatient);
    });

    it('should update a patient by ID', async () => {
        const updatedPatient = { id: 'gx12hhat3', name: 'Updated Patient' };
        patientController.updatePatient.mockImplementation((req, res) => res.status(200).json(updatedPatient));
        const res = await request(app).put('/patient/gx12hhat3').send(updatedPatient);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(updatedPatient);
    });

    it('should delete a patient by ID', async () => {
        patientController.deletePatient.mockImplementation((req, res) => res.status(204).send());
        const res = await request(app).delete('/patient/gx12hhat3');
        expect(res.status).to.equal(204);
    });

    it('should get appointments for a patient', async () => {
        const appointments = [{ id: 'gx12hhat3', date: '2023-10-10' }];
        appointmentController.getAppointmentsByPatient.mockImplementation((req, res) => res.status(200).json(appointments));
        const res = await request(app).get('/appointments');
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(appointments);
    });
});