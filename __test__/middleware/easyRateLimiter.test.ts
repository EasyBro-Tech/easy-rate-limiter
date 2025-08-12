import express from 'express'
import request from 'supertest'
import { easyRateLimiter } from '../../src/index'

describe('easyRateLimiter middleware', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();

        app.use(
            easyRateLimiter({
                capacity: 2,
                refillRate: 1,
                keyGenerator: (req) => req.ip || 'EasyBro!',
                message: 'Rate Limit Exceeded!'
            })
        );

        app.get('/', (req, res) => {
            res.send('Allowed Request')
        });
    });

    it('should allow up to the capacity of requests', async () => {
        const res1 = await request(app).get('/');
        expect(res1.status).toBe(200);

        const res2 = await request(app).get('/');
        expect(res2.status).toBe(200);
    });

    it('should block when capacity is exceeded', async () => {
        await request(app).get('/');
        await request(app).get('/');

        const res3 = await request(app).get('/');
        expect(res3.status).toBe(429);
        expect(res3.body.error).toBe('Rate Limit Exceeded!');
    });

    it('should allow after refill time', async () => {
        await request(app).get('/');
        await request(app).get('/');
        await request(app).get('/');

        await new Promise((resolve) => setTimeout(resolve, 1100));
        const res4 = await request(app).get('/');
        expect(res4.status).toBe(200);
    });
});