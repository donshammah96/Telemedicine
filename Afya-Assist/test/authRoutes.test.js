import request from 'supertest';
import express from 'express';
import * as chai from 'chai';
import sinon from 'sinon';
import authRoutes from '../routes/authRoutes.js';
import aiModels from '../models/aiModels.js'; // Example user model

const { expect } = chai;
const app = express();
app.use(express.json());
app.use('/', authRoutes);

describe('Auth Routes', () => {
    let mockUser;

    beforeEach(() => {
        mockUser = sinon.stub(aiModels, 'create');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should register a new user', async () => {
        mockUser.resolves({
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email_address: 'john.doe@example.com',
        });

        const response = await request(app)
            .post('/register')
            .send({
                first_name: 'John',
                last_name: 'Doe',
                email_address: 'john.doe@example.com',
                password: 'password123',
                confirm_password: 'password123',
                phone: '1234567890',
                date_of_birth: '1990-01-01',
                address: '123 Main St',
                gender: 'male',
                userType: 'patient',
                terms: true,
                language: 'English',
            });
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('User registered successfully');
    });

    it('should login a user', async () => {
        // Mock login behavior
        const mockLogin = sinon.stub(aiModels, 'findByCredentials');
        mockLogin.resolves({ id: 1, email: 'john.doe@example.com' });

        const response = await request(app)
            .post('/login')
            .send({
                email: 'john.doe@example.com',
                password: 'password123',
                userType: 'patient',
            });
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Login successful');
    });

    it('should logout a user', async () => {
        const response = await request(app)
            .post('/logout');
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Logout successful');
    });
});