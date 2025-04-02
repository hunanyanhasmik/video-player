const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');


const app = express();
const PORT = 3000;

let videos = [
    { id: "1", title: "Piper", filePath: "./videos/piper.mp4" },
    { id: "2", title: "Penguins Of Madagascar", filePath: "./videos/penguins-of-adagascar.mp4" },
    { id: "3", title: "Pixar Final", filePath: "./videos/pixar-final.mp4" },
    { id: "4", title: "Day & Night", filePath: "./videos/day-night.mp4" },
];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/videos', (req, res) => {
    res.json(videos);
});

app.get('/videos/:id', (req, res) => {
    const video = videos.find(v => v.id === req.params.id);

    if (video && fs.existsSync(video.filePath)) {
        res.sendFile(path.resolve(video.filePath));
    } else {
        res.status(404).send('Video not found');
    }
});


app.post('/upload-video', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Video file are required');
    }

    const newVideo = {
        id: Date.now().toString(),
        title: path.basename(req.file.originalname, path.extname(req.file.originalname)),
        filePath: `uploads/${req.file.filename}`
    };

    videos.push(newVideo);
    res.status(201).json(newVideo);
});


app.post('/create-video', upload.single('video'), (req, res) => {
    if (!req.file || !req.body.title) {
        return res.status(400).send('Title and video file are required');
    }

    const newVideo = {
        id: Date.now().toString(),
        title: req.body.title,
        filePath: `uploads/${req.file.filename}`,
    };

    videos.push(newVideo);
    res.status(201).json(newVideo);
});


app.put('/videos/:id', upload.single('video'), (req, res) => {
    const videoIndex = videos.findIndex(video => video.id === req.params.id);

    if (videoIndex === -1) {
        return res.status(404).send('Video not found');
    }

    if (req.body.title) {
        videos[videoIndex].title = req.body.title;
    }

    res.json(videos[videoIndex]);
});


app.delete('/videos/:id', (req, res) => {
    const videoIndex = videos.findIndex(video => video.id === req.params.id);

    if (videoIndex !== -1) {
        const deletedVideo = videos.splice(videoIndex, 1)[0];
        fs.unlinkSync(deletedVideo.filePath);
        res.json({ message: "Video deleted" });
    } else {
        res.status(404).send("Video not found");
    }
});


app.get('/stream/:id', (req, res) => {
    const video = videos.find(v => v.id === req.params.id);
    if (!video) return res.status(404).send('Video not found');

    const videoPath = path.join(__dirname, video.filePath);

    if (!fs.existsSync(videoPath)) {
        return res.status(404).send('Video not found');
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);

        const CHUNK_SIZE = 10 * 1024 * 1024;
        let end = Math.min(start + CHUNK_SIZE, fileSize - 1);

        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });

        const header = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, header);
        file.pipe(res);
    } else {
        const header = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, header);
        fs.createReadStream(videoPath).pipe(res);
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




















