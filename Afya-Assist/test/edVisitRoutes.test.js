import request from 'supertest';
import express from 'express';
import * as chai from 'chai';
import edVisitRoutes from '../routes/edVisitRoutes.js';
import edVisitController from '../controllers/edVisitController.js';
import jest from 'jest-mock';

const { expect } = chai;
const app = express();
app.use(express.json());
app.use('/', edVisitRoutes);

jest.mock('../controllers/edVisitController.js');

describe('ED Visit Routes', () => {
    it('should get all ED visits', async () => {
        edVisitController.getEdVisits.mockImplementation((req, res) => res.status(200).json([]));
        const res = await request(app).get('/edVisits');
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal([]);
    });

    it('should get a specific ED visit by ID', async () => {
        const edVisit = { id: '1', patient_id: '123', reason: 'Test Reason' };
        edVisitController.getEdVisit.mockImplementation((req, res) => res.status(200).json(edVisit));
        const res = await request(app).get('/edVisit/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(edVisit);
    });

    it('should create a new ED visit', async () => {
        const newEdVisit = { patient_id: '123', date: '2023-10-01', reason: 'Test Reason' };
        edVisitController.createEdVisit.mockImplementation((req, res) => res.status(201).json(newEdVisit));
        const res = await request(app).post('/edVisit').send(newEdVisit);
        expect(res.status).to.equal(201);
        expect(res.body).to.deep.equal(newEdVisit);
    });

    it('should update an ED visit by ID', async () => {
        const updatedEdVisit = { id: '1', patient_id: '123', reason: 'Updated Reason' };
        edVisitController.updateEdVisit.mockImplementation((req, res) => res.status(200).json(updatedEdVisit));
        const res = await request(app).put('/edVisit/1').send(updatedEdVisit);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(updatedEdVisit);
    });

    it('should delete an ED visit by ID', async () => {
        edVisitController.deleteEdVisit.mockImplementation((req, res) => res.status(204).send());
        const res = await request(app).delete('/edVisit/1');
        expect(res.status).to.equal(204);
    });
});