import request from 'supertest';
import { expect } from 'chai';
import app from '../index.js';

//const { expect } = chai;

describe('Express App Tests', () => {
    it('GET / - should return a welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'Welcome to the API!');
    });

    it('GET /nonexistent - should return 404 for unknown routes', async () => {
        const res = await request(app).get('/nonexistent');
        expect(res.status).to.equal(404);
    });

    it('POST /register - should return the register page', async () => {
        const res = await request(app).post('/register');
        expect(res.status).to.equal(200);
    });

    it('GET /register - should return the register page', async () => {
        const res = await request(app).get('/register');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
    });

    it('GET /login - should return the login page', async () => {
        const res = await request(app).get('/login');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Login');
    });

    it('POST /login - should return the login page', async () => {
        const res = await request(app).post('/login');
        expect(res.status).to.equal(200);
    });

    it('POST /logout - should return the logout page', async () => {
        const res = await request(app).get('/logout');
        expect(res.status).to.equal(200);
    });

    it('GET /about - should return the about page', async () => {
        const res = await request(app).get('/about');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('About');
    });

    it('GET /contact - should return the contact page', async () => {
        const res = await request(app).get('/contact');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Contact');
    });

    it('GET /patients - should return the patients page', async() => {
        const res = await request(app).get('/pages/patients');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Patients')
    });

    it('POST /patient - should return the patient page', async () => {
        const res = await request(app).post('/pages/patient');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Patient');
    });

    it('GET /doctors - should return the doctors page', async() => {
        const res = await request(app).get('/pages/doctors');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Doctors')
    });

    it('POST /doctor - should return the doctor page', async () => {
        const res = await request(app).post('/pages/doctor');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Doctor');
    });

    it('GET /admins - should return the admins page', async() => {
        const res = await request(app).get('/pages/admins');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Administrators')
    });

    it('POST /admin - should return the admin page', async () => {
        const res = await request(app).post('/pages/admin');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Administrator');
    });

    it('GET /appointments - should return the appointments page', async() => {
        const res = await request(app).get('/pages/appointments');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Appointments')
    });

    it('POST /appointment - should return the appointment page', async () => {
        const res = await request(app).post('/pages/appointment');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Appointment');
    });

    it('GET /admissions - should return the admissions page', async() => {
        const res = await request(app).get('/pages/admissions');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Admissions')
    });

    it('POST /admission - should return the dadmission page', async () => {
        const res = await request(app).post('/pages/admission');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Admission');
    });

    it('GET /visits - should return the visits page', async() => {
        const res = await request(app).get('/pages/visits');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Visits')
    });

    it('POST /visit - should return the visit page', async () => {
        const res = await request(app).post('/pages/visit');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Visit');
    });

    it('GET /discharges - should return the discharges page', async() => {
        const res = await request(app).get('/pages/discharges');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Discharges')
    });

    it('POST /discharge - should return the discharge page', async () => {
        const res = await request(app).post('/pages/discharge');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Discharge');
    });

    it('GET /healthCenters - should return the healthCenters page', async() => {
        const res = await request(app).get('/pages/healthCenters');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Health Centers')
    });

    it('POST /healthCenter - should return the healthCenter page', async () => {
        const res = await request(app).post('/pages/healthCenter');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Health Center');
    });

    it('GET /edVisits - should return the edVisits page', async() => {
        const res = await request(app).get('/pages/edVisits');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('edVisits')
    });

    it('POST /edVisit - should return the edVisit page', async () => {
        const res = await request(app).post('/pages/edVisit');
        expect(res.status).to.equal(200);
        expect(res.text).to.include('edVisit');
    });

});
