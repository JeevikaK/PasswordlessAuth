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
  const [showComponent, setShowComponent] = useState(false);
  const [recMail, setRecMail] = useState('');
  const [recPhone, setRecPhone] = useState('');
  const [camOn, setCamOn] = useState(false);
  const [blob, setBlob] = useState(null)
  const [loadingContent, setLoadingContent] = useState('Registering....')
  const [loading, setLoading] = useState(false)

  window.appid = useParams().id

  function recovery() {
    setShowComponent(true);
  }

  useEffect(() => {
    if (localStorage.getItem('username') === null) {
      navigate('/'.concat(window.appid).concat('/signup'))
    }
    const endpoint1 = process.env.REACT_APP_BASE_API + '/api/get_user/'.concat(localStorage.getItem('username'))
    axios.get(endpoint1)
      .then((res) => {
        if(res.data.userExists){
          navigate('/'.concat(window.appid).concat('/signup'))
        }
        // console.log(res.data.face_auth)
    })

    const endpoint2 = process.env.REACT_APP_BASE_API + '/api/get_app/'.concat(window.appid)
    axios.get(endpoint2)
      .then((res) => {
        window.appname = res.data.app_name
        console.log(window.appname)
        setId(window.appname)
      })
      .catch((err) => console.log(err))
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCamOn(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const takePhoto = () => {
    if (!camOn) {
      return
    }
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL();
    canvas.toBlob((blob) => {
      setBlob(blob)
    })
    setPhoto(dataUrl);
  };

  function goBack() {
    let link = '/'.concat(window.appid).concat('/signup')
    navigate(link);
  }

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    const formData = new FormData();
    console.log(typeof blob, blob)
    formData.append('face_image', blob, "photo.jpeg");
    formData.append("recovery_email", recMail);
    formData.append("recovery_phone_number", recPhone);
    formData.append('username', localStorage.getItem('username'));
    formData.append('app_id', window.appid)
    try {
      let response = await fetch(process.env.REACT_APP_BASE_API + '/api/signup-face-auth', {
        method: 'POST',
        body: formData,
      })
      let json = await response.json();
      console.log(json)
      console.log('registered!');
      localStorage.removeItem('username')
      const redirect = json.redirect_url+'?code='+json.code+'&len='+json.nonce_len+'&mode=video'
      window.location.href = redirect
    }
    catch (err) {
      console.log(err);
    }
    setLoading(false)
  };

  return (
    <div className="h-screen bg-black overflow-auto">
      <AppNameComponent />
      <p className='font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>{id}</p>
      {localStorage.getItem('username') && <p className='font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>Username : {localStorage.getItem('username')}</p>}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className='bg-gray-800 p-5 mt-8 rounded-xl mb-5'>
          <h1 className='text-xl text-center font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 md:text-3xl dark:text-white'>Register your Face</h1>
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
            {photo && !loading && <button
              onClick={recovery}
              type="button"
              data-te-ripple-init
              data-te-ripple-color="light"
              className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
              Next
            </button>}
            {loading && (
                <div className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 mt-6 text-xs font-medium uppercase leading-normal text-gray-200 ">
                {loadingContent}...
                </div>
            )}
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
      {showComponent && <RecoveryComponent 
        submission={handleSubmit} 
        setRecMail={setRecMail} 
        setRecPhone={setRecPhone} 
        setLoading={setLoading}
        loading={loading}
        loadingContent={loadingContent} />}
    </div>

  );
}

export default Camera;
