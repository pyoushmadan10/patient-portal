import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Controller to handle file upload
export const uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const { originalname, path, size } = req.file;
    const document = await prisma.document.create({
      data: {
        filename: originalname,
        filepath: path,
        filesize: size,
      },
    });
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save document metadata.' });
  }
};

// Controller to get all documents
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      select: {
        id: true,
        filename: true,
        filesize: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    res.status(200).json(documents);
  } catch (error) {
    console.log("No documents found")
    res.status(500).json({ error: 'Failed to retrieve documents.' });
  }
};

// Controller to download a document
export const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const filePath = path.resolve(document.filepath);

    if (fs.existsSync(filePath)) {
      res.download(filePath, document.filename, (err) => {
        if (err) {
          // Handle error, but don't overwrite response if headers are already sent
          console.error('Download error:', err);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Could not download the file.' });
          }
        }
      });
    } else {
      res.status(404).json({ error: 'File not found on server.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to download document.' });
  }
};

// Controller to delete a document
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    // Delete file from filesystem
    fs.unlink(path.resolve(document.filepath), async (err) => {
      if (err) {
        console.error('Failed to delete file from filesystem:', err);
      }

      // Delete metadata from database
      await prisma.document.delete({
        where: { id },
      });

      res.status(200).json({ message: 'Document deleted successfully.' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document.' });
  }
};