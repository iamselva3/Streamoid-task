import express from "express";
import { parseUploadedFile } from '../utils/parsefile.js';  
import Marketplace from '../models/Marketplace.js';
import fse from 'fs-extra';
import multer from 'multer';

const upload = multer({ dest: 'tmp/' });
const router = express.Router();

// POST /api/seller/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'file required' });
    const parsed = await parseUploadedFile(req.file.path, req.file.originalname);
    await fse.remove(req.file.path);
    // return columns and sampleRows to the frontend mapping UI
    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

export default router;
