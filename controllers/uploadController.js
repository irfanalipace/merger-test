const Video = require("../models/Video");
const path = require("path");

const handleUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = path.join("uploads", req.file.filename);

    // Get the current highest sequence number
    const lastVideo = await Video.findOne().sort({ sequence: -1 });
    const nextSequence = lastVideo ? lastVideo.sequence + 1 : 1;

    const video = new Video({
      filename: req.file.originalname,
      filepath: filePath,
      sequence: nextSequence,
    });

    await video.save();

    res.status(200).json({ message: "File uploaded successfully", video });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ sequence: 1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

module.exports = { handleUpload, getAllVideos };
