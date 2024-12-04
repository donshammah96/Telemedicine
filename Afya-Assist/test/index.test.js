import request from 'supertest';
import express from 'express';
import * as chai from 'chai';
import indexRoutes from '../routes/indexRoutes.js';
import authController from '../controllers/authController.js';

const { expect } = chai;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', indexRoutes);

describe('Index Routes', () => {
  it('should render home page', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).to.equal(200);
    expect(res.text).to.contain('Welcome to TeleMed - Your Healthcare Anywhere!');
  });

  it('should render about page', async () => {
    const res = await request(app).get('/about');
    expect(res.statusCode).to.equal(200);
    expect(res.text).to.contain('About');
  });

  it('should render contact page', async () => {
    const res = await request(app).get('/contact');
    expect(res.statusCode).to.equal(200);
    expect(res.text).to.contain('Contact');
  });

  it('should render login page', async () => {
    const res = await request(app).get('/login');
    expect(res.statusCode).to.equal(200);
    expect(res.text).to.contain('Login');
  });

  it('should render register page', async () => {
    const res = await request(app).get('/register');
    expect(res.statusCode).to.equal(200);
    expect(res.text).to.contain('Register');
  });

  it('should register a new user', async () => {
    const res = await request(app)
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
        language: 'English'
      });
    expect(res.statusCode).to.equal(201);
    expect(res.text).to.contain('User registered successfully');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
        userType: 'patient'
      });
    expect(res.statusCode).to.equal(200);
    expect(res.text).to.contain('Login successful');
  });

  it('should logout a user', async () => {
    const res = await request(app).post('/logout');
    expect(res.statusCode).to.equal(200);
    expect(res.text).to.contain('Logout successful');
  });
});