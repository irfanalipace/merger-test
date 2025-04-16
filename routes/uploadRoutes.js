const express = require("express");
const multer = require("multer");
const path = require("path");
const Video = require("../models/videoModel");
const router = express.Router();

// Ensure uploads directory exists
const fs = require("fs");
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Upload route
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const latestVideo = await Video.findOne().sort({ sequence: -1 });
    const sequenceNumber = latestVideo ? latestVideo.sequence + 1 : 1;

    const newVideo = new Video({
      filename: req.file.originalname,
      filepath: req.file.path,
      sequence: sequenceNumber,
    });

    await newVideo.save();

    res.status(201).json({
      message: "File uploaded successfully",
      video: {
        _id: newVideo._id,
        filename: newVideo.filename,
        filepath: newVideo.filepath,
        sequence: newVideo.sequence
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
});

// Get all videos
router.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ sequence: 1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos" });
  }
});

module.exports = router;