import request from 'supertest';
import * as chai from 'chai';
import express from 'express';
import router from '../routes/admissionRoutes.js';

const { expect } = chai;
const app = express();
app.use('/', router);

describe('Admission Routes', () => {
    it('should get all admissions', async () => {
        const res = await request(app).get('/admissions/');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('should get a specific admission by ID', async () => {
        const res = await request(app).get('/admission/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id', 1);
    });

    it('should create a new admission', async () => {
        const newAdmission = {
            admission_date: '2023-10-01',
            primary_diagnosis: 'Test Diagnosis',
            service: 'Test Service'
        };
        const res = await request(app).post('/admission/').send(newAdmission);
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('admission_date', '2023-10-01');
    });

    it('should update an admission by ID', async () => {
        const updatedAdmission = {
            primary_diagnosis: 'Updated Diagnosis'
        };
        const res = await request(app).put('/admission/1').send(updatedAdmission);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('primary_diagnosis', 'Updated Diagnosis');
    });

    it('should delete an admission by ID', async () => {
        const res = await request(app).delete('/admission/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'The admission has been successfully deleted.');
    });
});