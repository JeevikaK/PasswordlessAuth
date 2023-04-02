import React, { useState, useRef, useEffect } from 'react';
import AppNameComponent from './AppNameComponent';
import default_image from '../other/camera.jpg'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';


const VideoRecorder = () => {
  const [id, setId] = useState('')
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false)
  const [loadingContent, setLoadingContent] = useState('Verifying...')
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Verification failed. Please try again.')
  const [userMail, setUserMail] = useState('')

  const navigate = useNavigate();
  const videoRef = useRef(null);
  window.appid = useParams().id

  useEffect(() => {
    if (localStorage.getItem('username') === null) {
      navigate('/'.concat(window.appid).concat('/login'))
    }
    const endpoint1 = process.env.REACT_APP_BASE_API + '/api/get_user/'.concat(localStorage.getItem('username'))
    axios.get(endpoint1)
      .then((res) => {
        setUserMail(res.data.recovery_email)
        // console.log(res.data.face_auth)
        if (!res.data.face_auth) {
          navigate('/'.concat(window.appid).concat('/login'))
        }

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


  const handleStart = () => {
    setError(false)
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
          const url = URL.createObjectURL(window.blob);
          handleSubmit()
        };

        mediaRecorder.start();
        videoRef.current.srcObject = stream;
      }).then(() => {
        setTimeout(() =>{
          handleStop()
        }, 6000)
      })
      .catch((error) => {
        console.error(error);
        setRecording(false);
      });

  };

  const handleStop = () => {
    setLoading(true)
    const mediaRecorder = videoRef.current.srcObject;
    mediaRecorder.getTracks().forEach((track) => track.stop())
    videoRef.current.srcObject = null;
  };

  const handleSubmit = async () => {
    setLoading(true)
    setLoadingContent('Verifying your face...')
    const formData = new FormData();
    formData.append('username', localStorage.getItem('username'))
    formData.append('face_video', window.blob)
    formData.append('app_id', window.appid)

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
        const redirect = json.redirect_url+'?code='+json.code+'&len='+json.nonce_len+'&mode=video'
        window.location.href = redirect
      }
      else{
        console.log('not verified!')
        setError(true)
      }
    }
    catch (err) {
      console.log(err)
    }
    setLoading(false)
    setRecording(false);
  }

  function goBack(){
    let link = '/'.concat(window.appid).concat('/login')
    navigate(link);
  }

  const sendRecMail = async (e) => {
    e.preventDefault();
    console.log('sending mail')
    e.preventDefault();
    console.log('sending mail')
    const endpoint = process.env.REACT_APP_BASE_API + '/api/recover_create'
    let resp = await axios.post(endpoint, {
      'username': localStorage.getItem('username'),
      'method': 'video',
      'base_url': window.location.origin + '/' + window.appid ,
    })
    console.log(resp.data)
    let magicNotif = document.getElementById('magicNotif')
    magicNotif.hidden = false
    setTimeout(()=>{
      magicNotif.hidden = true
    }, 2000)
  }

  return (
    <div className='h-screen bg-black overflow-auto'>
        <AppNameComponent />
        <p className='font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>{id}</p>
        {localStorage.getItem('username') && <p className='font-bold leading-tight tracking-tight text-gray-400 mb-8 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>Username : {localStorage.getItem('username')}</p>}

        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
            <div className="bg-gray-800 p-8 m-8 rounded-xl">
            <h1 className='text-xl text-center font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 pb-4 md:text-3xl dark:text-white'>Verify your Face</h1>
            <form className='flex flex-col items-center justify-center'>
                {!recording && 
                    <button 
                        onClick={handleStart}
                        data-te-ripple-init
                        data-te-ripple-color="light"
                        className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                        {error ? 'Record Again' : 'Start Recording'}
                    </button>
                }
                
                {loading && (
                    <div className='flex flex-col items-center justify-center'>
                      <p className='text-gray-400'>{loadingContent}</p>
                    </div>
                )}
                {!loading && recording &&  (
                    <div>
                      <video ref={videoRef} autoPlay poster={default_image} style={{ width: '500px'}}/>
                    </div>
                )}
            </form>

            {error && <p className='text-red-500 m-6'>{errorMessage}</p>}
            {userMail!='' && <p className="text-sm text-center my-6 font-light text-gray-200 dark:text-gray-400" >
              Recover your account using email? <a href='' onClick={sendRecMail} className="font-medium text-primary-600 hover:underline cursor-pointer dark:text-primary-500">{userMail}</a>
              <br/>
              <span id='magicNotif' hidden={true}>Magic Link sent!</span>
            </p>}

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

    </div>
  );
};

export default VideoRecorder;
