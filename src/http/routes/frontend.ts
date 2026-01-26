import express, { type Express } from "express";
import path from "path";

const frontendRoutes = (app: Express) => {
  const buildPath = path.join(process.cwd(), "frontend");

  // Serve React static files
  app.use(express.static(buildPath));

  // React Router fallback (all unmatched GET requests)
  app.get('/*\w', (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
};

export default frontendRoutes;
