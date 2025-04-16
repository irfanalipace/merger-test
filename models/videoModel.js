const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  filepath: {
    type: String,
    required: true
  },
  sequence: {
    type: Number,
    required: true,
    unique: true
  }
}, { timestamps: true });

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;