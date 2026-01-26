import corsMw from "cors";
import config from "../../config.js";
import logger from "../../logger.js";
const corsMiddleware = corsMw({
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl or mobile apps)
    if (!origin) return callback(null, true);

    logger.debug({allowedOrigins: config.app.allowedOrigins, origin}, "allowed origins");
    if (config.app.allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
});

export default corsMiddleware;
