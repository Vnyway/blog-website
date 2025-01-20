import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import router from '../routes/auth.js';
import jwt from 'jsonwebtoken';
import { s3Bloggers } from '../buckets/s3clientBloggers.js';
import UserModel from '../models/User.js';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';

jest.mock('../buckets/s3clientBloggers');
jest.mock('jsonwebtoken');
jest.mock('../models/User');

const app = express();
app.use(express.json());
app.use(router);
app.use(cookieParser());

const mockGetSignedUrl = jest.fn().mockResolvedValue('mock-signed-url');
s3Bloggers.send = mockGetSignedUrl;

const mockUser = {
  _id: '12345',
  username: 'testuser',
  password: bcrypt.hashSync('password123', 10),
  image: 'imageKey.jpg',
};

UserModel.create = jest.fn().mockResolvedValue(mockUser);
UserModel.findOne = jest.fn().mockResolvedValue(mockUser);
UserModel.findById = jest.fn().mockResolvedValue(mockUser);
jwt.sign = jest
  .fn()
  .mockImplementation((payload, secret, options, callback) => {
    callback(null, 'fake-jwt-token');
  });
jwt.verify = jest.fn((token, secret, options, callback) => {
  callback(null, { id: '12345', username: 'testuser', image: 'imageUrl' });
});

describe('Auth Routes', () => {
  describe('POST /register', () => {
    it('should register a user and return user data', async () => {
      const response = await request(app)
        .post('/register')
        .field('username', 'testuser')
        .field('password', 'password123')
        .attach('file', Buffer.from('dummy image'), 'test.jpg');

      expect(response.status).toBe(200);
      expect(response.body.username).toBe('testuser');
      expect(UserModel.create).toHaveBeenCalledTimes(1);
    });

    it('should handle file upload failure', async () => {
      s3Bloggers.send.mockRejectedValue(new Error('Failed to upload image'));
      const response = await request(app)
        .post('/register')
        .field('username', 'testuser')
        .field('password', 'password123')
        .attach('file', Buffer.from('dummy image'), 'test.jpg');

      expect(response.status).toBe(500);
      expect(response.body).toBe('Failed to upload image');
    });
  });

  describe('POST /login', () => {
    it('should return 404 if user is not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/login')
        .send({ username: 'nonexistentuser', password: 'password123' });

      expect(response.status).toBe(404);
      expect(response.body).toBe('User not found');
    });

    it('should return 400 if password is incorrect', async () => {
      UserModel.findOne.mockResolvedValue(mockUser);
      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(response.status).toBe(400);
      expect(response.body).toBe('Wrong password');
    });
  });

  describe('POST /logout', () => {
    it('should clear the token and log out the user', async () => {
      const response = await request(app).post('/logout');

      expect(response.status).toBe(200);
      expect(response.body).toBe('OK');
    });
  });
});
