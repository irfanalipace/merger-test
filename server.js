// // backend/server.js
// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const taskRoutes = require("./routes/taskRoutes");
// const authRoutes = require("./routes/authRoutes");

// dotenv.config();
// connectDB();

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.use(express.json());

// app.use("/api/tasks", taskRoutes);
// app.use("/api/auth", authRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// const express = require('express');
// const multer = require('multer');
// const ffmpeg = require('fluent-ffmpeg');
// const path = require('path');
// const app = express();

// // Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' });

// app.post('/upload', upload.array('videos', 3), (req, res) => {
//   const videoFiles = req.files.map(file => path.join(__dirname, 'uploads', file.filename));

//   // Create output file path
//   const outputFile = path.join(__dirname, 'uploads', 'output.mp4');

//   // Merge videos using FFmpeg
//   ffmpeg()
//     .input(videoFiles[0])
//     .input(videoFiles[1])
//     .input(videoFiles[2])
//     .on('end', () => {
//       res.json({ message: 'Videos merged successfully', output: outputFile });
//     })
//     .on('error', (err) => {
//       console.error('Error:', err);
//       res.status(500).json({ error: err.message });
//     })
//     .mergeToFile(outputFile);
// });

// app.listen(5000, () => {
//   console.log('Server running on port 5000');
// });

// const express = require('express');
// const multer = require('multer');
// const ffmpeg = require('fluent-ffmpeg');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const PORT = 5000;

// // Set FFmpeg path explicitly
// ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe'); // Replace with your actual FFmpeg path

// app.use(cors());
// app.use('/uploads', express.static('uploads'));
// app.use('/merged', express.static('merged'));

// // Ensure folders exist
// const uploadsDir = path.join(__dirname, 'uploads');
// const mergedDir = path.join(__dirname, 'merged');
// if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
// if (!fs.existsSync(mergedDir)) fs.mkdirSync(mergedDir);

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads'),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
// });
// const upload = multer({ storage });

// app.post('/merge-videos', upload.array('videos', 10), (req, res) => {
//   const files = req.files;

//   if (!files || files.length < 2) {
//     return res.status(400).json({ error: 'Upload at least 2 videos.' });
//   }

//   const sortedFiles = files.sort((a, b) => a.originalname.localeCompare(b.originalname));
//   const outputPath = path.join(mergedDir, `merged_${Date.now()}.mp4`);

//   const command = ffmpeg();

//   const filterInputs = [];
//   const scaleFilters = [];

//   sortedFiles.forEach((file, index) => {
//     command.addInput(file.path);
//     scaleFilters.push(`[${index}:v]scale=320:240[v${index}]`);
//     filterInputs.push(`[v${index}]`);
//   });

//   const layout = filterInputs.map((_, i) => `${i * 320}_0`).join('|');

//   const fullFilter = [
//     ...scaleFilters,
//     `${filterInputs.join('')}xstack=inputs=${sortedFiles.length}:layout=${layout}[out]`
//   ];

//   command
//     .complexFilter(fullFilter)
//     .outputOptions(['-map', '[out]', '-preset', 'fast'])
//     .on('start', cmd => console.log('FFmpeg started:', cmd))
//     .on('end', () => {
//       sortedFiles.forEach(f => fs.unlinkSync(f.path));
//       res.json({ url: `http://localhost:${PORT}/merged/${path.basename(outputPath)}` });
//     })
//     .on('error', (err, stdout, stderr) => {
//       console.error('FFmpeg error:', err.message);
//       return res.status(500).json({ error: err.message, stdout, stderr });
//     })
//     .save(outputPath);
// });

// app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));






// // server.js
// const express = require("express");
// const multer = require("multer");
// const ffmpeg = require("fluent-ffmpeg");
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");

// const app = express();
// const PORT = 5000;

// ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");

// app.use(cors());
// app.use("/uploads", express.static("uploads"));
// app.use("/merged", express.static("merged"));

// const uploadsDir = path.join(__dirname, "uploads");
// const mergedDir = path.join(__dirname, "merged");
// if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
// if (!fs.existsSync(mergedDir)) fs.mkdirSync(mergedDir);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads"),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
// });
// const upload = multer({ storage });

// app.post("/merge-videos", upload.array("videos", 4), (req, res) => {
//   const files = req.files;
//   if (!files || files.length < 2) {
//     return res.status(400).json({ error: "Please upload at least 2 videos" });
//   }

//   const outputPath = path.join(mergedDir, `merged_${Date.now()}.mp4`);

//   const command = ffmpeg();

//   files.forEach((file) => {
//     command.input(file.path);
//   });

//   let filterComplex = "";
//   const baseStream = "[0:v]";

//   filterComplex += `${baseStream}scale=640:360[base];`;

//   files.slice(1).forEach((_, index) => {
//     const inputIndex = index + 1;
//     const outputLabel = `overlay${inputIndex}`;
//     const prevLabel = inputIndex === 1 ? "base" : `overlay${inputIndex - 1}`;

//     const xPos = inputIndex * 50;
//     const yPos = inputIndex * 50;

//     filterComplex += `[${inputIndex}:v]scale=320:180[vid${inputIndex}];`;
//     filterComplex += `[${prevLabel}][vid${inputIndex}]overlay=${xPos}:${yPos}`;

//     if (inputIndex < files.length - 1) {
//       filterComplex += `[overlay${inputIndex}];`;
//     }
//   });

//   command
//     .complexFilter(filterComplex)
//     .outputOptions("-preset", "fast")
//     .on("start", (cmd) => console.log("FFmpeg command:", cmd))
//     .on("end", () => {
//       files.forEach((f) => fs.unlinkSync(f.path));
//       res.json({
//         url: `http://localhost:${PORT}/merged/${path.basename(outputPath)}`,
//         message: "Videos merged successfully!",
//       });
//     })
//     .on("error", (err, stdout, stderr) => {
//       console.error("FFmpeg Error:", err.message);
//       console.error("FFmpeg stdout:", stdout);
//       console.error("FFmpeg stderr:", stderr);
//       res.status(500).json({
//         error: err.message,
//         details: stderr,
//       });
//     })
//     .save(outputPath);
// });

// app.listen(PORT, () =>
//   console.log(`🚀 Server running at http://localhost:${PORT}`)
// );













const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 5000;

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/merged", express.static("merged"));
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
const mergedDir = path.join(__dirname, "merged");

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(mergedDir)) fs.mkdirSync(mergedDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

app.post("/merge-videos", upload.array("videos", 10), async (req, res) => {
  const uploadedFiles = [...req.files];
  const linkList = JSON.parse(req.body.links || "[]");

  const allFiles = [...uploadedFiles];

  try {
    for (let link of linkList) {
      const response = await axios.get(link, { responseType: "stream" });
      const filename = `${Date.now()}-${uuidv4()}.mp4`;
      const filePath = path.join(uploadsDir, filename);

      const writer = fs.createWriteStream(filePath);
      await new Promise((resolve, reject) => {
        response.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      allFiles.push({ path: filePath });
    }

    if (allFiles.length < 2) {
      return res.status(400).json({ error: "At least 2 videos required." });
    }

    const outputPath = path.join(mergedDir, `merged_${Date.now()}.mp4`);
    const command = ffmpeg();

    allFiles.forEach((file) => command.input(file.path));

    let filterComplex = "";
    let lastLabel = `[0:v]`;

    for (let i = 1; i < allFiles.length; i++) {
      const label = `[${i}:v]`;
      const outLabel = `[out${i}]`;
      const prev = i === 1 ? lastLabel : `[out${i - 1}]`;

      filterComplex += `${prev}${label}overlay=${i * 30}:${i * 30}${i < allFiles.length - 1 ? outLabel : ""};`;
    }

    filterComplex = filterComplex.slice(0, -1); 

    command
      .complexFilter(filterComplex)
      .on("start", (cmd) => console.log("FFmpeg command:", cmd))
      .on("end", () => {
        allFiles.forEach((f) => fs.existsSync(f.path) && fs.unlinkSync(f.path));
        res.json({
          url: `http://localhost:${PORT}/merged/${path.basename(outputPath)}`,
          message: "Merged successfully!",
        });
      })
      .on("error", (err, stdout, stderr) => {
        console.error("FFmpeg Error:", err.message);
        res.status(500).json({ error: err.message });
      })
      .save(outputPath);
  } catch (err) {
    console.error("Merge Error:", err.message);
    res.status(500).json({ error: "Merge failed." });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
