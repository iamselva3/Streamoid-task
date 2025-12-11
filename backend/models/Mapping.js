import mongoose from "mongoose";

const MappingSchema = new mongoose.Schema({
  marketplaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Marketplace", required: true },
  marketplaceName: String,
  sellerFilename: String,
  sellerColumns: [String],
  mapping: mongoose.Schema.Types.Mixed, // { targetAttr: sourceColumn }
  sampleRows: [mongoose.Schema.Types.Mixed],
  createdBy: String, 
  createdAt: { type: Date, default: Date.now },
});

const Mapping = mongoose.model("Mapping", MappingSchema);

export default Mapping;
