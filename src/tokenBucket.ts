export class TokenBucket {
    private capacity: number;
    private tokens: number;
    private refillRate: number;
    private lastRefill: number;

    constructor({ capacity, refillRate }: { capacity: number; refillRate: number }) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.refillRate = refillRate;
        this.lastRefill = Date.now();
    }

    refill() {
        const now = Date.now();
        const elapsed = (now - this.lastRefill) / 1000;
        const refillAmount = elapsed * this.refillRate;

        this.tokens = Math.min(this.capacity, this.tokens + refillAmount);
        this.lastRefill = now;
    }

    consumeToken(): boolean {
        this.refill();

        if (this.tokens >= 1) {
            this.tokens -= 1;
            return true;
        }
        return false;
    }
}