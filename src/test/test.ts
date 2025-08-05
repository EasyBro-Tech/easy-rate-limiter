import express from 'express'
import { easyRateLimiter } from '..'

const app = express();

const limiter = easyRateLimiter({
    capacity: 5,
    refillRate: 1
})

app.use(limiter);

app.get('/', (req, res) => {
    res.send('request allowed')
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});