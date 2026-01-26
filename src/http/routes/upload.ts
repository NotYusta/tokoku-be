import express, { type Express } from "express";
import { UploadConstants } from "../../constants/upload.js";
const uploadRoutes = (app: Express) => {
  app.use(
    UploadConstants.UPLOAD_URL_PREFIX,
    express.static(UploadConstants.UPLOAD_DIR),
  );
};

export default uploadRoutes;
