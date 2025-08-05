import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import documentRoutes from './routes/document.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin:'http://localhost:5173', // Allow requests from the React frontend
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/documents', documentRoutes);

// Global error handler for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // An unknown error occurred when uploading.
    return res.status(400).json({ error: err.message });
  }
  next();
});


app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});