import request from 'supertest';
import * as chai from 'chai';
import express from 'express';
import adminRoutes from '../routes/adminRoutes.js';

const { expect } = chai;
const app = express();
app.use('/', adminRoutes);


describe('Admin Routes', () => {
    it('should get all admins', async () => {
        const res = await request(app).get('/pages/admins/');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('should get a specific admin by ID', async () => {
        const res = await request(app).get('/pages/admin/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
    });

    it('should create a new admin', async () => {
        const res = await request(app)
            .post('/admin/')
            .send({ first_name: 'John', doctor_speciality: 'Cardiology', doctor_availability: 'Monday' });
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
    });

    it('should update an admin by ID', async () => {
        const res = await request(app)
            .put('/pages/admin/1')
            .send({ first_name: 'Jane' });
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
    });

    it('should delete an admin by ID', async () => {
        const res = await request(app).delete('/pages/admin/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
    });

    it('should get the admin dashboard', async () => {
        const res = await request(app).get('/pages/admins/dashboard');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
    });

    it('should update admin profile', async () => {
        const res = await request(app)
            .post('/profile')
            .send({ first_name: 'John', last_name: 'Doe', role: 'Admin' });
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
    });

    it('should create an appointment', async () => {
        const res = await request(app)
            .post('/pages/appointments')
            .send({ patient_id: 1, doctor_id: 1, appointment_date: '2023-10-10' });
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
    });
});