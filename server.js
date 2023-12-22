const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server); // socket.io
const rtsp = require('./lib/rtsp-ffmpeg'); // rtsp-ffmpeg
const fs = require("fs");

server.listen(3000, () => {
    console.log('Listening on port 3000');
});

let cams = [
    'rtsp://nckusport:Ncku1234@10.30.3.1:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.2:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.3:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.4:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.5:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.6:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.7:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.8:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.9:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.10:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.11:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.12:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.13:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.14:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.15:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.16:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.17:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.18:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.19:554/stream0',
    'rtsp://nckusport:Ncku1234@10.30.3.20:554/stream0',
    // 'rtsp://nckusport:Ncku1234@10.30.3.21:554/stream0',
    // 'rtsp://nckusport:Ncku1234@10.30.3.22:554/stream0',
    // 'rtsp://nckusport:Ncku1234@10.30.3.23:554/stream0',
    // 'rtsp://nckusport:Ncku1234@10.30.3.24:554/stream0',
    // 'rtsp://nckusport:Ncku1234@10.30.3.25:554/stream0',
    // 'rtsp://nckusport:Ncku1234@10.30.3.26:554/stream0',
    // 'rtsp://nckusport:Ncku1234@10.30.3.27:554/stream0',
    // 'rtsp://nckusport:Ncku1234@10.30.3.28:554/stream0',
    // 'rtsp://nckusport:Ncku1234@10.30.3.29:554/stream0',  
    // 'rtsp://nckusport:Ncku1234@10.30.3.30:554/stream0'
].map(function(uri, i) {
    let stream = new rtsp.FFMpeg({input: uri, rate: 30, resolution: '700x360', quality: 3});
    
    stream.on('start', function() {
        console.log('stream ' + i + ' started');
    });
    stream.on('stop', function() {
        console.log('stream ' + i + ' stopped');
    });
    return stream;
});


cams.forEach(function(camStream, i) {
    let ns = io.of('/cam' + i);
    ns.on('connection', function(wsocket) {
        console.log('connected to /cam' + i);
        let pipeStream = function(data) {
            wsocket.emit('data', data);
        };
        camStream.on('data', pipeStream);

        wsocket.on('disconnect', function() {
            console.log('disconnected from /cam' + i);
            camStream.removeListener('data', pipeStream);
        });
    });
});


io.on('connection', function(socket) {
    socket.emit('start', cams.length);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});
app.use('/', express.static(__dirname));

// app.get('/video_stitch', (req, res) => {
//     // Ensure there is a range given for the video
// 	const range = req.headers.range;
// 	if (!range) {
// 	  res.status(400).send("Requires Range header");
// 	}
  
// 	// get video stats (about 61MB)
// 	//RotReplay.mkv output_1.mkv
// 	const videoPath = "data/StitchingRst_20231004.mkv";
// 	const videoSize = fs.statSync("data/StitchingRst_20231004.mkv").size;
	
// 	// Parse Range
// 	// Example: "bytes=32324-"
// 	const CHUNK_SIZE = 10 ** 6; // 10MB
// 	const start = Number(range.replace(/\D/g, ""));
// 	const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  
// 	// Create headers
// 	const contentLength = end - start + 1;
// 	const headers = {
// 		"Content-Range": `bytes ${start}-${end}/${videoSize}`,
// 		"Accept-Ranges": "bytes",
// 		"Content-Length": contentLength,
// 		"Content-Type": "video/mp4",
// 	};
  
// 	// HTTP Status 206 for Partial Content
// 	res.writeHead(206, headers);
  
// 	// create video read stream for this particular chunk
// 	const videoStream = fs.createReadStream(videoPath, { start, end });
  
// 	// Stream the video chunk to the client
// 	videoStream.pipe(res);
// });

// app.get('/video_stitch2', (req, res) => {
//     // Ensure there is a range given for the video
// 	const range = req.headers.range;
// 	if (!range) {
// 	  res.status(400).send("Requires Range header");
// 	}
  
// 	// get video stats (about 61MB)
// 	//RotReplay.mkv output_1.mkv
// 	const videoPath = "data/output.mkv";
// 	const videoSize = fs.statSync("data/output.mkv").size;
	
// 	// Parse Range
// 	// Example: "bytes=32324-"
// 	const CHUNK_SIZE = 10 ** 6; // 10MB
// 	const start = Number(range.replace(/\D/g, ""));
// 	const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  
// 	// Create headers
// 	const contentLength = end - start + 1;
// 	const headers = {
// 		"Content-Range": `bytes ${start}-${end}/${videoSize}`,
// 		"Accept-Ranges": "bytes",
// 		"Content-Length": contentLength,
// 		"Content-Type": "video/mp4",
// 	};
  
// 	// HTTP Status 206 for Partial Content
// 	res.writeHead(206, headers);
  
// 	// create video read stream for this particular chunk
// 	const videoStream = fs.createReadStream(videoPath, { start, end });
  
// 	// Stream the video chunk to the client
// 	videoStream.pipe(res);
// });

// app.get('/video_rot', (req, res) => {
//     // Ensure there is a range given for the video
// 	const range = req.headers.range;
// 	if (!range) {
// 	  res.status(400).send("Requires Range header");
// 	}
  
// 	// get video stats (about 61MB)
// 	//RotReplay.mkv output_1.mkv
// 	const videoPath = "data/RotReplay.mkv";
// 	const videoSize = fs.statSync("data/RotReplay.mkv").size;
	
// 	// Parse Range
// 	// Example: "bytes=32324-"
// 	const CHUNK_SIZE = 10 ** 6; // 10MB
// 	const start = Number(range.replace(/\D/g, ""));
// 	const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  
// 	// Create headers
// 	const contentLength = end - start + 1;
// 	const headers = {
// 		"Content-Range": `bytes ${start}-${end}/${videoSize}`,
// 		"Accept-Ranges": "bytes",
// 		"Content-Length": contentLength,
// 		"Content-Type": "video/mp4",
// 	};
  
// 	// HTTP Status 206 for Partial Content
// 	res.writeHead(206, headers);
  
// 	// create video read stream for this particular chunk
// 	const videoStream = fs.createReadStream(videoPath, { start, end });
  
// 	// Stream the video chunk to the client
// 	videoStream.pipe(res);
// });

// app.get('/video_rot2', (req, res) => {
//     // Ensure there is a range given for the video
// 	const range = req.headers.range;
// 	if (!range) {
// 	  res.status(400).send("Requires Range header");
// 	}
  
// 	// get video stats (about 61MB)
// 	//RotReplay.mkv output_1.mkv
// 	const videoPath = "data/Colmap_V01_20231003.mp4";
// 	const videoSize = fs.statSync("data/Colmap_V01_20231003.mp4").size;
	
// 	// Parse Range
// 	// Example: "bytes=32324-"
// 	const CHUNK_SIZE = 10 ** 6; // 10MB
// 	const start = Number(range.replace(/\D/g, ""));
// 	const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  
// 	// Create headers
// 	const contentLength = end - start + 1;
// 	const headers = {
// 		"Content-Range": `bytes ${start}-${end}/${videoSize}`,
// 		"Accept-Ranges": "bytes",
// 		"Content-Length": contentLength,
// 		"Content-Type": "video/mp4",
// 	};
  
// 	// HTTP Status 206 for Partial Content
// 	res.writeHead(206, headers);
  
// 	// create video read stream for this particular chunk
// 	const videoStream = fs.createReadStream(videoPath, { start, end });
  
// 	// Stream the video chunk to the client
// 	videoStream.pipe(res);
// });