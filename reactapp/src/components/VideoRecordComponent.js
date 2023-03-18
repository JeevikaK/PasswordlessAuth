import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppNameComponent from './AppNameComponent';
import default_image from '../other/camera.jpg'
import axios from 'axios'
import RecoveryComponent from './recoveryComponent';

function Camera() {

  const navigate = useNavigate();

  const videoRef = useRef(null);

  const [id, setId] = useState('')
  const [photo, setPhoto] = useState(null);
  let [state, setState] = useState(useParams().state)
  const [showComponent, setShowComponent] = useState(false);
  const [recMail, setRecMail] = useState('');
  const [recPhone, setRecPhone] = useState('');
  const [camOn, setCamOn] = useState(false);

  window.appid = useParams().id

  function recovery(){
    setShowComponent(true);
  }

  useEffect(() => {
    const link = process.env.REACT_APP_BASE_API + '/api/get_app/'.concat(window.appid)
    console.log(link)
    axios.get(link)
    .then((res) => {
        window.appname = res.data.app_name
        console.log(window.appname)
        setId(window.appname)
    })
    .catch((err) => console.log(err))
  },[])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCamOn(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
  };

  const takePhoto = () => {
    if(!camOn){
      return 
    }
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL();
    setPhoto(dataUrl);
  };

  function goBack(){
    let link = '/'.concat(window.appid).concat('/').concat(state)
    navigate(link);
  }

  function handleSubmit(){}

  return (
    <div className="h-screen bg-black overflow-auto">
      <AppNameComponent />
      {state=='login' && <p className='font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>{ id }</p>}
      {localStorage.getItem('username') && <p className='font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>Username : {localStorage.getItem('username')}</p>}
      <div className="flex flex-col items-center justify-center items-center px-6 py-8 mx-auto lg:py-0">
        <div className='bg-gray-800 p-5 mt-8 rounded-xl mb-5'>
        {state=='signup' && <h1 className='text-xl text-center font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 md:text-3xl dark:text-white'>Register your Face</h1>}
        {state=='login' && <h1 className='text-xl text-center font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 md:text-3xl dark:text-white'>Verify your Face</h1>}
        <form className='flex flex-col items-center justify-center'>
          <video ref={videoRef} poster={default_image} autoPlay style={{ width: '500px', height: '400px' }} />
          <div className='flex space-x-4'>
            <button
              onClick={startCamera}
              type="button"
              data-te-ripple-init
              data-te-ripple-color="light"
              className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
              Start Camera
            </button>
            <button
              onClick={takePhoto}
              type="button"
              data-te-ripple-init
              data-te-ripple-color="light"
              className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
              Take Photo
            </button>
          </div>
          {photo && <img src={photo} style={{ width: '300px', height: '250px' }} className='pt-5 pb-5' />}
          {photo && <button
              onClick={recovery}
              type="button"
              data-te-ripple-init
              data-te-ripple-color="light"
              className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
              Next
          </button>}
        </form>
        </div>
        <div className='flex space-x-4'>
          <button type='button'
              onClick={goBack}
              data-te-ripple-init
              data-te-ripple-color="light"
              className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 mt-6 mb-4 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
              Back
          </button>
        </div>
      </div>
      {showComponent && <RecoveryComponent submission = {handleSubmit} setRecMail={setRecMail} setRecPhone={setRecPhone}/>}
    </div>

  );
}

export default Camera;
