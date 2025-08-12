import { Request, Response, NextFunction } from 'express';
import { TokenBucket } from './tokenBucket';

type RateLimiterOptions = {
    capacity?: number;
    refillRate?: number;
    keyGenerator?: (req: Request) => string;
    message?: string;
};

const buckets = new Map<string, TokenBucket>();

export function easyRateLimiter(options: RateLimiterOptions) {
    const {
        capacity = 10,
        refillRate = 1,
        keyGenerator = (req) => req.ip,
        message = 'Too many requests. Please try again later.',
    } = options;

    return (req: Request, res: Response, next: NextFunction) => {
        const key = keyGenerator(req);

        if (!key) {
            return res.status(400).json({ error: 'Invalid key generated' });
        }

        if (!buckets.has(key)) {
            buckets.set(key, new TokenBucket({ capacity, refillRate }));
        }

        const bucket = buckets.get(key)!;

        if (bucket.consumeToken()) {
            return next();
        }

        return res.status(429).json({ error: message })
    }
}