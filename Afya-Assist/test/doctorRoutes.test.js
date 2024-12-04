import request from 'supertest';
import express from 'express';
import * as chai from 'chai';
import doctorRoutes from '../routes/doctorRoutes.js';
import doctorController from '../controllers/doctorController.js';

jest.mock('../controllers/doctorController.js');
jest.mock('../controllers/appointmentController.js');

const { expect } = chai;
const app = express();
app.use(express.json());
app.use('/', doctorRoutes);

describe('Doctor Routes', () => {
  it('should get doctor dashboard', async () => {
    doctorController.getDashboard.mockImplementation((req, res) => res.status(200).send());
    const res = await request(app).get('/doctors/dashboard');
    expect(res.statusCode).to.equal(200);
  });

  it('should get all doctors', async () => {
    doctorController.getDoctors.mockImplementation((req, res) => res.status(200).send());
    const res = await request(app).get('/doctors');
    expect(res.statusCode).to.equal(200);
  });

  it('should get a single doctor', async () => {
    doctorController.getDoctor.mockImplementation((req, res) => res.status(200).send());
    const res = await request(app).get('/doctor/1');
    expect(res.statusCode).to.equal(200);
  });

  it('should create a new doctor', async () => {
    doctorController.createDoctor.mockImplementation((req, res) => res.status(201).send());
    const res = await request(app).post('/doctor').send({ first_name: 'Dr. Smith', doctor_specialty: 'Cardiology' });
    expect(res.statusCode).to.equal(201);
  });

  it('should update a doctor', async () => {
    doctorController.updateDoctor.mockImplementation((req, res) => res.status(200).send());
    const res = await request(app).put('/doctor/1').send({ first_name: 'Dr. John Smith', doctor_specialty: 'Neurology' });
    expect(res.statusCode).to.equal(200);
  });

  it('should delete a doctor', async () => {
    doctorController.deleteDoctor.mockImplementation((req, res) => res.status(200).send());
    const res = await request(app).delete('/doctor/1');
    expect(res.statusCode).to.equal(200);
  });

  it('should get appointments by doctor_id', async () => {
    const appointments = [{ id: '1', date: '2023-10-10' }];
    doctorController.getAppointmentsByDoctor.mockImplementation((req, res) => res.status(200).json(appointments));
    const res = await request(app).get('/appointments');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal(appointments);
  });
});