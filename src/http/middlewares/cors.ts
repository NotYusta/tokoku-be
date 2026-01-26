import corsMw from "cors";
import config from "../../config.js";
const corsMiddleware = corsMw({
  origin: config.app.url, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

export default corsMiddleware;
