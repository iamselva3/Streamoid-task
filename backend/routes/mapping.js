import express from "express";
import Mapping from '../models/Mapping.js';
import Marketplace from '../models/Marketplace.js';

const router = express.Router();

// POST /api/mappings  - save mapping
router.post('/', async (req, res) => {
  try {
    const { marketplaceId, sellerFilename, sellerColumns, mapping, sampleRows, createdBy } = req.body;
    const mp = await Marketplace.findById(marketplaceId);
    if (!mp) return res.status(400).json({ error: 'invalid marketplaceId' });
    const doc = await Mapping.create({
      marketplaceId,
      marketplaceName: mp.name,
      sellerFilename: sellerFilename || '',
      sellerColumns: sellerColumns || [],
      mapping: mapping || {},
      sampleRows: sampleRows || [],
      createdBy: createdBy || null
    });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/mappings
router.get('/', async (req, res) => {
  const items = await Mapping.find().sort({ createdAt: -1 }).populate('marketplaceId');
  res.json(items.map(i => ({
    id: i._id,
    marketplaceId: i.marketplaceId?._id,
    marketplaceName: i.marketplaceName,
    sellerFilename: i.sellerFilename,
    sellerColumns: i.sellerColumns,
    mapping: i.mapping,
    sampleRows: i.sampleRows,
    createdAt: i.createdAt
  })));
});

export default router;
