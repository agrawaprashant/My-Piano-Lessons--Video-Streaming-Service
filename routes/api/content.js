const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/content/:path", (req, res) => {
  try {
    const filePath =
      req.params.path.split('$').join('/') ||
      "C:/Users/Prashant Agarwal/Downloads/[FreeCourseSite.com] Udemy - Pianoforall - Incredible New Way To Learn Piano & Keyboard/9. Speed learning/14. Video for lesson 7.mp4";
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    const fileExt = path.extname(filePath);
    if (fileExt.includes(".mp4")) {
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize,
          "Content-Type": "video/mp4",
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4",
        };
        res.writeHead(200, head);
        return fs.createReadStream(filePath).pipe(res);
      }
    } else if (fileExt.includes(".pdf")) {
      return fs.createReadStream(filePath).pipe(res);
    } else {
      return res.status(400).send("File type not supported!");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error!");
  }
});

module.exports = router;
