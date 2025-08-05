import { Router } from 'express';
import {
  uploadDocument,
  getAllDocuments,
  downloadDocument,
  deleteDocument,
} from '../controllers/document.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();

// Route for uploading a single PDF file
router.post('/upload', upload.single('file'), uploadDocument);

// Route for getting all documents
router.get('/', getAllDocuments);

// Route for downloading a document by ID
router.get('/:id', downloadDocument);

// Route for deleting a document by ID
router.delete('/:id', deleteDocument);

export default router;