import express from "express";
import { parseUploadedFile } from '../utils/parsefile.js';  
import Marketplace from '../models/Marketplace.js';
import fse from 'fs-extra';
import multer from 'multer';

const upload = multer({ dest: 'tmp/' });
const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (req.file) {
      // parse CSV to build attributes array (assumes CSV has rows: key,type,required,...)
      const { columns, sampleRows } = await parseUploadedFile(req.file.path, req.file.originalname);
      // Simple assumption: the CSV has header rows describing attributes OR you might want to accept file where each row is attribute definition.
      // For fastest path: treat uploaded CSV's rows as attribute definitions like { key, type, required }
      // Parse sampleRows into attributes:
      const attributes = sampleRows.map(r => ({
        key: r.key || r.name || r.attribute || Object.values(r)[0],
        type: r.type || 'string',
        required: (r.required === 'true' || r.required === '1' || r.required === true)
      })).filter(a => a.key);
      const mp = await Marketplace.create({ name: req.body.name || req.file.originalname, attributes });
      await fse.remove(req.file.path);
      return res.json(mp);
    } else {
      // Accept JSON body to create template
      const { name, attributes } = req.body;
      const mp = await Marketplace.create({ name, attributes });
      return res.json(mp);
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const all = await Marketplace.find().sort({ createdAt: -1 });
  res.json(all);
});

router.get('/:id', async (req, res) => {
  const mp = await Marketplace.findById(req.params.id);
  if (!mp) return res.status(404).json({ error: 'not found' });
  res.json(mp);
});

export default router;