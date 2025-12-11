import mongoose from "mongoose";

const AttrSchema = new mongoose.Schema({
  key: String,
  type: String,
  required: { type: Boolean, default: false },
  extra: mongoose.Schema.Types.Mixed,
});

const MarketplaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  attributes: [AttrSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Marketplace", MarketplaceSchema);
