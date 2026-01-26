import rateLimit from "express-rate-limit";

const ratelimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // allow 1000 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: "Too many requests, try again later." });
  },
});

export default ratelimitMiddleware;
