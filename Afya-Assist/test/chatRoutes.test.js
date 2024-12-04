import request from 'supertest';
import express from 'express';
import * as chai from 'chai';
import chatRoutes from '../routes/chatRoutes.js';

const { expect } = chai;
const app = express();
app.use('/', chatRoutes);

describe('Chat Routes', () => {
    it('should get chat history', async () => {
        const res = await request(app).get('/history/testRoom?page=1&limit=10');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('messages');
        expect(res.body).to.have.property('metadata');
    });

    it('should send a new message', async () => {
        const res = await request(app)
            .post('/send')
            .send({ room: 'testRoom', sender: 'testUser', message: 'Hello' });
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('room', 'testRoom');
        expect(res.body).to.have.property('sender', 'testUser');
        expect(res.body).to.have.property('message', 'Hello');
    });

    it('should delete a message', async () => {
        const res = await request(app).delete('/delete/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'Message deleted successfully');
    });

    it('should mark messages as read', async () => {
        const res = await request(app)
            .post('/mark-as-read')
            .send({ room: 'testRoom', reader: 'testUser' });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('updated');
    });

    it('should search messages by keyword', async () => {
        const res = await request(app).get('/search/testRoom?keyword=Hello');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('should get unread message count', async () => {
        const res = await request(app).get('/unread/testRoom/testUser');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('unread');
    });
});