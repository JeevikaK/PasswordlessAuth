import React, { useState, useRef } from 'react';
import { w3cwebsocket as WebSocket } from 'websocket';
import AppNameComponent from './AppNameComponent';
import default_image from '../other/camera.jpg'


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

        let url = `ws://${window.location.host}/ws/video-upload/`
        const ws = new WebSocket(url);

        ws.onmessage = () => {
          console.log("hello testing")
        }

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
    <div className='h-screen bg-black overflow-auto'>
        <AppNameComponent />
        {localStorage.getItem('username') && <p className='font-bold leading-tight tracking-tight text-gray-400 mb-8 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>Username : {localStorage.getItem('username')}</p>}

        <div className="flex flex-col items-center justify-center items-center px-6 py-8 mx-auto lg:py-0">
            <div className="bg-gray-800 p-5 mt-8 rounded-xl mb-5">
            <h1 className='text-xl text-center font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 pb-4 md:text-3xl dark:text-white'>Verify your Face</h1>
            <form className='flex flex-col items-center justify-center'>
                {!recording && !recordedVideo && 
                    <button 
                        onClick={handleStart}
                        data-te-ripple-init
                        data-te-ripple-color="light"
                        className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                        Start Recording
                    </button>
                }
                {recording && 
                    <button
                        onClick={handleStop}
                        data-te-ripple-init
                        data-te-ripple-color="light"
                        className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 mb-3 text-xs font-medium uppercase leading-normal text-gray-300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                        Stop Recording
                    </button>}
                    <div className='flex flex-col items-center justify-center'>
                        {recordedVideo && (
                        <div className='flex flex-col items-center justify-center'>
                            <video src={recordedVideo} ref={videoRef} controls style={{ width: '500px'}} />
                            <button onClick={handleClear}
                                data-te-ripple-init
                                data-te-ripple-color="light"
                                className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 mt-3 text-xs font-medium uppercase leading-normal text-gray-300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                                Re-Record
                            </button>
                        </div>
                        )}
                        {recordedVideo && (
                            <button
                                type='submit'
                                data-te-ripple-init
                                data-te-ripple-color="light"
                                className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 mt-3 text-xs font-medium uppercase leading-normal text-gray-300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                                Submit
                            </button>
                        )}
                    </div>

                {recording && (
                    <div>
                    <video ref={videoRef} autoPlay poster={default_image} style={{ width: '500px'}}/>
                    </div>
                )}
            </form>

            </div>
        </div>

    </div>
  );
};

export default VideoRecorder;
