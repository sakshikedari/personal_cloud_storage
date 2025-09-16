const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const protect = require("../middleware/authMiddleware");
const File = require("../models/fileModel"); 


const storage = multer.memoryStorage();
const upload = multer({ storage });

const MAX_STORAGE = 16 * 1024 * 1024 * 1024; 

router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const files = await File.find({ user: req.user._id });
    const usedStorage = files.reduce((acc, f) => acc + (f.size || 0), 0);

    if (usedStorage + req.file.size > MAX_STORAGE) {
      return res.status(400).json({ message: "Storage limit reached" });
    }

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      const fileDoc = await File.create({
        user: req.user._id,
        filename: req.file.originalname,
        gridfsId: uploadStream.id,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      res.json(fileDoc);
    });

    uploadStream.on("error", (err) => {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Upload failed" });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ message: "Error fetching files" });
  }
});

// GET single file
router.get("/:id", protect, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) return res.status(404).json({ error: "File not found" });

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads", 
    });

    const download = req.query.download === "true";

    res.set("Content-Type", file.mimetype);

    if (download) {
      res.set(
        "Content-Disposition",
        `attachment; filename="${file.filename}"`
      );
    } else {
      res.set(
        "Content-Disposition",
        `inline; filename="${file.filename}"`
      );
    }

    const stream = bucket.openDownloadStream(file.gridfsId);
    stream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found" });

    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });

    await bucket.delete(file.gridfsId);
    await file.deleteOne();

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Error deleting file", error: err.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const filename = (req.body.filename || "").trim();
    if (!filename) return res.status(400).json({ message: "filename is required" });

    const file = await File.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { filename } },
      { new: true }
    );

    if (!file) return res.status(404).json({ message: "File not found" });

    res.json(file);
  } catch (err) {
    console.error("Rename error:", err);
    res.status(500).json({ message: "Error renaming file", error: err.message });
  }
});


// GET highlights
router.get("/:id/highlights", protect, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) return res.status(404).json({ error: "File not found" });
    res.json(file.highlights || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST single highlight
router.post("/:id/highlights", protect, async (req, res) => {
  try {
    const { text, pageNumber, coordinates } = req.body;
    const file = await File.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) return res.status(404).json({ error: "File not found" });

    const highlight = { text, pageNumber, coordinates };
    file.highlights.push(highlight);
    await file.save();

    res.status(201).json(highlight);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT replace all highlights
router.put("/:id/highlights", protect, async (req, res) => {
  try {
    const { highlights } = req.body;
    const file = await File.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { highlights } },
      { new: true }
    );
    if (!file) return res.status(404).json({ error: "File not found" });
    res.json(file.highlights || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
