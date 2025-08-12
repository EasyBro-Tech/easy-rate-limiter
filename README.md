# easybroRateLimiter

A simple, lightweight, in-memory rate limiting middleware for Express.js using the **Token Bucket** algorithm.  
It helps protect your API from abuse by limiting the number of requests a client can make within a given time frame.

https://www.npmjs.com/package/easybro-rate-limiter

---

## 📦 Installation

```bash
npm install easy-rate-limiter
# or
yarn add easy-rate-limiter
```

---

## 🚀 Quick Start

```javascript
import express from 'express';
import { easyRateLimiter } from 'easy-rate-limiter';

const app = express();

// Apply rate limiter to all routes
app.use(easyRateLimiter({
  capacity: 5,       // Max tokens
  refillRate: 1,     // Tokens per second
}));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## ⚙️ Options

`easyRateLimiter` accepts the following configuration options:

| Option         | Type                       | Default Value                                  | Description                                                                   |
| -------------- | -------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------- |
| `capacity`     | `number`                   | `10`                                           | Maximum number of tokens in the bucket (burst limit).                         |
| `refillRate`   | `number`                   | `1`                                            | Number of tokens added per second.                                            |
| `keyGenerator` | `(req: Request) => string` | `(req) => req.ip`                              | Function that generates a unique key per client (e.g., IP, user ID, API key). |
| `message`      | `string`                   | `"Too many requests. Please try again later."` | Error message returned when the limit is exceeded.                            |

---

## 🛠 How It Works (Token Bucket Algorithm)

- **Bucket Capacity (`capacity`)**: The maximum number of requests that can be made instantly (burst).
- **Refill Rate (`refillRate`)**: How many tokens are added back per second.
- **Token Consumption**: Each incoming request consumes one token.
- **Limit Exceeded**: If the bucket has no tokens left, the request is rejected with **HTTP 429**.

**Example:**
```
Capacity = 5, Refill Rate = 1/sec

A client can make up to 5 requests instantly, then 1 request per second thereafter.
```

---

## 🔑 Custom Key Generation

You can identify clients by something other than their IP. For example, using an API key:

```typescript
app.use(easyRateLimiter({
  capacity: 20,
  refillRate: 5,
  keyGenerator: (req) => req.headers['x-api-key'] as string,
  message: 'Rate limit exceeded for your API key.'
}));
```

---

## 🎯 Apply to Specific Routes

Instead of applying globally, you can apply it per-route:

```javascript
const apiLimiter = easyRateLimiter({ capacity: 3, refillRate: 1 });

app.get('/public', (req, res) => res.send('Public route, no limit'));
app.get('/protected', apiLimiter, (req, res) => res.send('Protected route'));
```

---

## 🧪 Example With Express Router

```javascript
import express from 'express';
import { easyRateLimiter } from 'easy-rate-limiter';

const router = express.Router();
const limiter = easyRateLimiter({ capacity: 5, refillRate: 2 });

router.get('/data', limiter, (req, res) => {
  res.json({ data: 'Some rate-limited data' });
});

export default router;
```

---

## 📜 API Responses

When the limit is reached, the middleware responds with:  
**Status:** `429 Too Many Requests`

```json
{
  "error": "Too many requests. Please try again later."
}
```

---

## ⚠️ Notes & Limitations

- This implementation is **in-memory**. It does not persist data across server restarts or multiple instances.
- Suitable for **single-instance deployments** or low-scale APIs.
- For distributed setups, integrate with a **shared store** like Redis *(planned future enhancement)*.

---

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request.

---

Made with ❤️ by [Vishal Vishwakarma](https://github.com/vishal4real)
