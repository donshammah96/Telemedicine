import request from 'supertest';
import express from 'express';
import * as chai from 'chai';
import router from '../routes/appointmentRoutes.js';

const { expect } = chai;
const app = express();
app.use('/', router);

describe('Appointment Routes', () => {
    it('should get all appointments', async () => {
        const res = await request(app).get('/appointments');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('should get upcoming appointments', async () => {
        const res = await request(app).get('/upcoming?doctorId=1');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('should get a specific appointment by ID', async () => {
        const res = await request(app).get('/appointment/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
    });

    it('should get appointments for a specific patient', async () => {
        const res = await request(app).get('/patient/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('should get appointments for a specific doctor', async () => {
        const res = await request(app).get('/doctor/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('should create a new appointment', async () => {
        const res = await request(app)
            .post('/appointment')
            .send({ patient_id: 1, doctor_id: 1, appointment_date: '2023-10-10' });
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
    });

    it('should update an appointment by ID', async () => {
        const res = await request(app)
            .put('/appointment/1')
            .send({ appointment_date: '2023-10-11' });
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
    });

    it('should delete an appointment by ID', async () => {
        const res = await request(app).delete('/appointment/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
    });
});