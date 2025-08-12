import { TokenBucket } from '../src/tokenBucket';

describe('TokenBucket', () => {
    it('should consume a token if available', () => {
        const bucket = new TokenBucket({ capacity: 5, refillRate: 1 });
        const result = bucket.consumeToken();
        expect(result).toBe(true);
    });

    it('should not consume a token if none are available', () => {
        const bucket = new TokenBucket({ capacity: 1, refillRate: 0 });
        bucket.consumeToken();
        const result = bucket.consumeToken();
        expect(result).toBe(false);
    })

    it('should refill tokens over time', async () => {
        const bucket = new TokenBucket({ capacity: 2, refillRate: 1 });

        bucket.consumeToken();
        bucket.consumeToken();

        await new Promise((resolve) => setTimeout(resolve, 1100));

        const result = bucket.consumeToken();
        expect(result).toBe(true);
    });

    it('should not exceed capacity when refilling', async () => {
        const bucket = new TokenBucket({ capacity: 2, refillRate: 10 });

        await new Promise((resolve) => setTimeout(resolve, 500));
        bucket.consumeToken();
        
        expect(bucket['tokens']).toBeLessThanOrEqual(2);
    });

})