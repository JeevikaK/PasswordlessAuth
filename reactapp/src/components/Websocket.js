import React, { useState, useRef } from 'react';

const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [webSocket, setWebSocket] = useState(null);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const videoRef = useRef(null);

  const handleStart = () => {
    setRecording(true);

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);

          if (webSocket && webSocket.readyState === WebSocket.OPEN) {
            webSocket.send(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);
          setRecordedVideo(url);

          if (webSocket && webSocket.readyState === WebSocket.OPEN) {
            webSocket.send('STOP');
          }
        };

        mediaRecorder.start();
        videoRef.current.srcObject = stream;

        const ws = new WebSocket('ws://localhost:8000/ws/video-upload/');

        ws.onopen = () => {
          console.log('WebSocket connected');
          setWebSocket(ws);
        };

        ws.onclose = () => {
          console.log('WebSocket closed');
          setWebSocket(null);
        };

        ws.onerror = (error) => {
          console.error(error);
        };
      })
      .catch((error) => {
        console.error(error);
        setRecording(false);
      });
  };

  const handleStop = () => {
    setRecording(false);

    const mediaRecorder = videoRef.current.srcObject;
    mediaRecorder.getTracks().forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  };

  const handleClear = () => {
    setRecordedVideo(null);
  };

  return (
    <div>
      {!recording && !recordedVideo && <button onClick={handleStart}>Start Recording</button>}
      {recording && <button onClick={handleStop}>Stop Recording</button>}
      {recordedVideo && (
        <div>
          <video src={recordedVideo} ref={videoRef} controls />
          <button onClick={handleClear}>Re-Record</button>
        </div>
      )}
      {recording && (
        <div>
          <video ref={videoRef} autoPlay />
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;