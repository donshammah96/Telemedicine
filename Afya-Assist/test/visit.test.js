import request from 'supertest';
import express from 'express';
import * as chai from 'chai';
import visitRoutes from '../routes/visitRoutes.js';
import visitController from '../controllers/visitController.js';
import jest from 'jest-mock';

const { expect } = chai;
app.use(express.json());
app.use('/', visitRoutes);

jest.mock('../controllers/visitController.js');

describe('Visit Routes', () => {
    it('should get all visits', async () => {
        visitController.getVisits.mockImplementation((req, res) => res.status(200).json([]));
        const res = await request(app).get('/visits');
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal([]);
    });

    it('should get a specific visit by ID', async () => {
        const visit = { id: '1', name: 'Visit 1' };
        visitController.getVisit.mockImplementation((req, res) => res.status(200).json(visit));
        const res = await request(app).get('/visit/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(visit);
    });

    it('should create a new visit', async () => {
        const newVisit = { name: 'New Visit' };
        visitController.createVisit.mockImplementation((req, res) => res.status(201).json(newVisit));
        const res = await request(app).post('/visit').send(newVisit);
        expect(res.status).to.equal(201);
        expect(res.body).to.deep.equal(newVisit);
    });

    it('should update a visit by ID', async () => {
        const updatedVisit = { id: '1', name: 'Updated Visit' };
        visitController.updateVisit.mockImplementation((req, res) => res.status(200).json(updatedVisit));
        const res = await request(app).put('/visit/1').send(updatedVisit);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(updatedVisit);
    });

    it('should delete a visit by ID', async () => {
        visitController.deleteVisit.mockImplementation((req, res) => res.status(204).send());
        const res = await request(app).delete('/visit/1');
        expect(res.status).to.equal(204);
    });
});