import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import noteRoutes from './routes/notes.js';
import authRoutes from './routes/auth.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

const app = express();

app.set('trust proxy', 1);

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'ok' },
    error: null,
  });
});

app.use(noteRoutes);
app.use(authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// Conexión a MongoDB (solo conecta, no llama a app.listen)
mongoose
  .connect(process.env.MONGO_URI!, { maxPoolSize: 10 })
  .catch((err) => {
    console.error('Error de conexión a MongoDB:', err);
  });

// Exportar la app para Vercel (serverless)
export default app;