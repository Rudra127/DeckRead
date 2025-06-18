import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp"; // Prevent HTTP parameter pollution
import morgan from "morgan"; // Request logging for development
import auth from "./api/auth.js";
import HandleErrors from "./utils/error-handler.js";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { setupSwagger } from "./utils/index.js";
import user from "./api/user.js";

const expressApp = async (app) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Basic middleware
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  // CORS configuration
  app.use(
    cors({
      origin: (process.env.CLIENT_URLS || "http://localhost:3000").split(","),
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // Prevent HTTP Parameter Pollution
  app.use(hpp());

  // Development Logging
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  // Safe sanitization middleware
  app.use((req, res, next) => {
    // Create sanitized copies of query and body
    const sanitizedQuery = {};
    const sanitizedBody = {};

    // Sanitize query parameters
    if (req.query) {
      Object.entries(req.query).forEach(([key, value]) => {
        sanitizedQuery[key] =
          typeof value === "string" ? value.replace(/[<>]/g, "") : value;
      });
    }

    // Sanitize body parameters
    if (req.body) {
      Object.entries(req.body).forEach(([key, value]) => {
        sanitizedBody[key] =
          typeof value === "string" ? value.replace(/[<>]/g, "") : value;
      });
    }

    // Attach sanitized data to request
    req.sanitizedQuery = sanitizedQuery;
    req.sanitizedBody = sanitizedBody;

    next();
  });

  app.get("/", (req, res, next) => {
    res.status(200).json({
      message: "Welcome to the default backend of BackendHub.",
      apiDocs: {
        description:
          "You can find the API documentation at the following link:",
        link: "http://localhost:8000/api-docs",
      },
    });
  });

  // Setup Swagger
  setupSwagger(app);

  // API routes
  auth(app);
  user(app);

  // Error handling
  app.use(HandleErrors);
};

export default expressApp;
