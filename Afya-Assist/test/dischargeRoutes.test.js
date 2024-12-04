import request from 'supertest';
import express from 'express';
import * as chai from 'chai';
import dischargeRoutes from '../routes/dischargeRoutes.js';

const { expect } = chai;
const app = express();
app.use(express.json());
app.use('/', dischargeRoutes);

describe('Discharge Routes', () => {
    it('should get all discharges', async () => {
        const res = await request(app).get('/discharges/');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('should get a specific discharge by ID', async () => {
        const res = await request(app).get('/discharge/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id', 1);
    });

    it('should create a new discharge', async () => {
        const newDischarge = {
            patient_id: 1,
            discharge_date: '2023-10-01',
            discharge_disposition: 'Recovered'
        };
        const res = await request(app).post('/discharge/').send(newDischarge);
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('patient_id', 1);
    });

    it('should update a discharge by ID', async () => {
        const updatedDischarge = {
            discharge_date: '2023-10-02',
            discharge_disposition: 'Improved'
        };
        const res = await request(app).put('/discharge/1').send(updatedDischarge);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('discharge_date', '2023-10-02');
    });

    it('should delete a discharge by ID', async () => {
        const res = await request(app).delete('/discharge/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'The discharge record has been successfully deleted.');
    });
});