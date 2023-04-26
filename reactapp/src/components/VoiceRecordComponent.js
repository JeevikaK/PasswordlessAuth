import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import AppNameComponent from './AppNameComponent';
import RecoveryComponent from './recoveryComponent';
import AlertComponent from './AlertComponent';

const VoiceRcordComponent = () => {

  const navigate = useNavigate();

  const [id, setId] = useState('')
  const [recorder, setRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [recMail, setRecMail] = useState('');
  const [recPhone, setRecPhone] = useState('');
  const [state, setState] = useState(useParams().state)
  const [loading, setLoading] = useState(false)
  const [loadingContent, setLoadingContent] = useState('')
  const [voicePlaceholder, setVoicePlaceholder] = useState(true)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Verification failed. Please try again.')
  const [userMail, setUserMail] = useState('')
  const [sendingMail, setSendingMail] = useState(false)


  window.appid = useParams().id

  useEffect(() => {

    console.log(state)
    if (localStorage.getItem('username') === null) {
      navigate('/'.concat(window.appid).concat('/').concat(state))
    }

    const endpoint1 = process.env.REACT_APP_BASE_API + '/api/get_user/'.concat(localStorage.getItem('username'))
    axios.get(endpoint1)
      .then((res) => {
        setUserMail(res.data.recovery_email)
        if ((state === 'login' && !res.data.voice_auth) || (state === 'signup' && res.data.voice_auth)) {
          navigate('/'.concat(window.appid).concat('/').concat(state))
        }

      })

    const endpoint2 = process.env.REACT_APP_BASE_API + '/api/get_app/'.concat(window.appid)
    axios.get(endpoint2)
      .then((res) => {
        window.appname = res.data.app_name
        setId(window.appname)
      })
      .catch((err) => console.log(err))

    setVoicePlaceholder(true)

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      setRecorder(new MediaRecorder(stream));
    });
  }, [])


  function goBack() {
    let link = '/'.concat(window.appid).concat('/').concat(state)
    navigate(link);
  }

  function recovery(e) {
    e.preventDefault();
    setShowComponent(true);
  }

  const startRecording = () => {
    setError(false)
    setIsRecording(true);
    setIsPlaying(false);
    recorder.start();
  };

  const stopRecording = () => {
    setVoicePlaceholder(false)
    setIsRecording(false);
    recorder.stop();
  };

  const recordAgain = () => {
    setVoicePlaceholder(true)
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleDataAvailable = (event) => {
    setAudioBlob(event.data);
    setAudioUrl(URL.createObjectURL(event.data));
  };

  const handleSignup = async (e) => {
    setLoading(true)
    setLoadingContent('Registering your voice...')
    e.preventDefault();
    const formData = new FormData();
    formData.append('voice_image', audioBlob, "recording.wav");
    formData.append("recovery_email", recMail);
    formData.append("recovery_phone_number", recPhone);
    formData.append('username', localStorage.getItem('username'));
    formData.append('app_id', window.appid)
    try {
      let response = await fetch(process.env.REACT_APP_BASE_API + '/api/signup-voice-auth', {
        method: 'POST',
        body: formData,
      })
      let json = await response.json();
      console.log('registered!');
      localStorage.removeItem('username')
      const redirect = json.redirect_url + '?code=' + json.code + '&len=' + json.nonce_len + '&mode=voice'
      window.location.href = redirect
    }
    catch (err) {
      console.log(err);
      setLoadingContent('')
      setLoading(false)
    }
  };

  const handleLogin = async (e) => {
    setLoading(true)
    setLoadingContent('Verifying your voice...')
    e.preventDefault();
    const formData = new FormData();
    formData.append('voice_image', audioBlob, "recording.wav");
    formData.append('username', localStorage.getItem('username'));
    formData.append('app_id', window.appid)
    formData.append('mode', 'web')
    try {
      let response = await fetch(process.env.REACT_APP_BASE_API + '/api/login-voice-auth', {
        method: 'POST',
        body: formData,
      })
      let json = await response.json();
      console.log(json);
      if (json.verified) {
        console.log('verified!')
        localStorage.removeItem('username')
        const redirect = json.redirect_url + '?code=' + json.code + '&len=' + json.nonce_len + '&mode=voice'
        window.location.href = redirect
      }
      else {
        console.log('not verified!')
        recordAgain()
        setError(true)
        setLoading(false)
      }
    }
    catch (err) {
      console.log(err);
      setLoadingContent('')
      setLoading(false)
    }
  }

  const sendRecMail = async (e) => {
    e.preventDefault();
    console.log('sending mail')
    setSendingMail(true)
    const endpoint = process.env.REACT_APP_BASE_API + '/api/recover_create'
    let resp = await axios.post(endpoint, {
      'username': localStorage.getItem('username'),
      'method': 'voice',
      'base_url': window.location.origin + '/' + window.appid,
    })
    console.log(resp.data)
    let magicNotif = document.getElementById('magicNotif')
    magicNotif.hidden = false
    setSendingMail(false)
    setTimeout(() => {
      magicNotif.hidden = true
    }, 2000)
  }

  useEffect(() => {
    if (recorder) {
      recorder.addEventListener('dataavailable', handleDataAvailable);
    }
    return () => {
      if (recorder) {
        recorder.removeEventListener('dataavailable', handleDataAvailable);
      }
    };
  }, [recorder]);

  return (
    <div className='h-screen bg-black overflow-auto'>
      <AppNameComponent />
      {state === 'login' && <p className='font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>{id}</p>}
      {localStorage.getItem('username') && <p className='font-bold leading-tight tracking-tight text-gray-400 mb-8 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>Username : {localStorage.getItem('username')}</p>}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-[22em] bg-gray-800 p-2 py-5 mb-2 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-center items-center">
          {state === 'signup' && <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 pb-4 md:text-3xl dark:text-white'>Register your Voice</h1>}
          {state === 'login' && <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 pb-4 md:text-3xl dark:text-white'>Verify your Voice</h1>}
          {voicePlaceholder && (<>
            <div className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 mt-6 text-xs font-medium uppercase leading-normal text-gray-200 ">
              Read the following text aloud
            </div>
            <div className="inline-block rounded text-center bg-gray-800 px-6 pt-2.5 pb-2 mt-6 text-s font-medium uppercase leading-normal text-gray-200 ">
              "The fox jumped out of the bush and chased the deer at an incredible speed"
            </div>
          </>
          )}
          <form className='p-3 flex flex-col justify-center items-center'>
            {audioUrl && (
              <div>
                <audio src={audioUrl} controls />
              </div>
            )}
            {!audioUrl && (<>
              <button
                onClick={startRecording}
                disabled={isRecording}
                type="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
                {isRecording ? 'Recording...' : 'Start Recording'}
              </button>
              <br />
              {error && <p className='text-red-500 text-sm mt-2'>{errorMessage}</p>}
            </>
            )}
            {isRecording && (
              <button
                onClick={stopRecording}
                data-te-ripple-init
                data-te-ripple-color="light"
                className="inline-block rounded bg-gray-800 px-6 pt-2.5 mt-8 pb-2 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
                Stop Recording</button>
            )}
            {audioUrl && (
              <button
                onClick={recordAgain}
                data-te-ripple-init
                data-te-ripple-color="light"
                className="inline-block rounded bg-gray-800 px-6 pt-2.5 mt-6 pb-2 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
                Record Again</button>
            )}

            {audioUrl && state === 'signup' && (
              <button
                type='submit'
                onClick={recovery}
                data-te-ripple-init
                data-te-ripple-color="light"
                className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 mt-6 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
                Next</button>
            )}

            {audioUrl && state === 'login' && !loading && (
              <button
                type='submit'
                onClick={handleLogin}
                data-te-ripple-init
                data-te-ripple-color="light"
                className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 mt-6 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
                Verify</button>
            )}
            {loading && (
              <div className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 mt-6 text-xs font-medium uppercase leading-normal text-gray-200 ">
                {loadingContent}...
              </div>
            )}
          </form>

          {state === 'login' && userMail != '' && <p className="text-sm text-center my-6 font-light text-gray-200 dark:text-gray-400" >
            Recover your account using email?
            {!sendingMail && <a href='' onClick={sendRecMail} className="font-medium text-primary-600 hover:underline cursor-pointer dark:text-primary-500">{userMail}</a>}<br />
            <br />
            {sendingMail && <span>Sending...</span>}
            <br />
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
        {state === 'login' && <AlertComponent mode='voice' state='login' message="Don't have a voice recorder? Login through phone" />}

      </div>
      {showComponent && <RecoveryComponent
        submission={handleSignup}
        setRecMail={setRecMail}
        setRecPhone={setRecPhone}
        setLoading={setLoading}
        loading={loading}
        loadingContent={loadingContent} />}

    </div>

  );
}

export default VoiceRcordComponent;
