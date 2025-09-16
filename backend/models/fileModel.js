const mongoose = require("mongoose");

const highlightSchema = new mongoose.Schema({
  text: String,
  pageNumber: Number,
  coordinates: {
    left: Number,
    top: Number,
    width: Number,
    height: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

const fileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filename: { type: String, required: true },
    gridfsId: { type: mongoose.Schema.Types.ObjectId, required: true },
    mimetype: String,
    size: Number,
    highlights: [highlightSchema], // embed schema for clarity
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
