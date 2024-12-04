import request from 'supertest';
import express from 'express';
import *as chai from 'chai';
import healthCenterRoutes from '../routes/healthCenterRoutes.js';
import healthCenterController from '../controllers/healthCenterController.js';
import jest from 'jest-mock';

const { expect } = chai;
const app = express();
app.use(express.json());
app.use('/', healthCenterRoutes);

jest.mock('../controllers/healthCenterController.js');

describe('Health Center Routes', () => {
    it('should get all health centers', async () => {
        healthCenterController.getHealthCenters.mockImplementation((req, res) => res.status(200).json([]));
        const res = await request(app).get('/healthCenters');
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal([]);
    });

    it('should get a specific health center by ID', async () => {
        const healthCenter = { id: '1', name: 'Health Center 1' };
        healthCenterController.getHealthCenter.mockImplementation((req, res) => res.status(200).json(healthCenter));
        const res = await request(app).get('/healthCenter/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(healthCenter);
    });

    it('should create a new health center', async () => {
        const newHealthCenter = { name: 'New Health Center' };
        healthCenterController.createHealthCenter.mockImplementation((req, res) => res.status(201).json(newHealthCenter));
        const res = await request(app).post('/healthCenter').send(newHealthCenter);
        expect(res.status).to.equal(201);
        expect(res.body).to.deep.equal(newHealthCenter);
    });

    it('should update a health center by ID', async () => {
        const updatedHealthCenter = { id: '1', name: 'Updated Health Center' };
        healthCenterController.updateHealthCenter.mockImplementation((req, res) => res.status(200).json(updatedHealthCenter));
        const res = await request(app).put('/healthCenter/1').send(updatedHealthCenter);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(updatedHealthCenter);
    });

    it('should delete a health center by ID', async () => {
        healthCenterController.deleteHealthCenter.mockImplementation((req, res) => res.status(204).send());
        const res = await request(app).delete('/healthCenter/1');
        expect(res.status).to.equal(204);
    });
});