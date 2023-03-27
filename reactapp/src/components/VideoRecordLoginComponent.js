import React, { useState, useRef } from 'react';
import { w3cwebsocket as WebSocket } from 'websocket';
import AppNameComponent from './AppNameComponent';
import default_image from '../other/camera.jpg'


const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [loading, setLoading] = useState(false)
  const [loadingContent, setLoadingContent] = useState('')

  const videoRef = useRef(null);

  const handleStart = () => {
    setRecording(true);

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          window.blob = new Blob(chunks, { type: 'video/mp4' });
          // console.log(window.blob)
          const url = URL.createObjectURL(window.blob);
          setRecordedVideo(url);
        };

        mediaRecorder.start();
        videoRef.current.srcObject = stream;
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

  const handleSubmit = async (e) => {
    console.log('im here')
    setLoading(true)
    setLoadingContent('Verifying your face...')
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', localStorage.getItem('username'))
    formData.append('face_video', window.blob)

    console.log(window.blob)
    try{
      let response = await fetch(process.env.REACT_APP_BASE_API  + '/api/login-face-auth', {
        method: 'POST',
        body: formData,
      })
      let json = await response.json();
      console.log(json)
      if(json.verified){
        console.log('verified!')
        localStorage.removeItem('username')
      }
      else{
        console.log('not verified!')
        setRecordedVideo(null)
      }
    }
    catch (err) {
      console.log(err)
      setLoadingContent('')
      setLoading(false)
    }
  }

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
                                onClick={handleSubmit}
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
