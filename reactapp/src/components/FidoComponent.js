import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import AppNameComponent from './AppNameComponent';
import RecoveryComponent from './recoveryComponent';

const FidoComponent = () => {

  const navigate = useNavigate();
  const [id, setId] = useState('')
  const [state, setState] = useState(useParams().state)
  const [recMail, setRecMail] = useState('')
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
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
        if ((state === 'login' && !res.data.fido_auth) || (state === 'signup' && res.data.fido_auth)) {
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
  }, [])


  function goBack() {
    let link = '/'.concat(window.appid).concat('/').concat(state)
    navigate(link);
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(false)
    const resp = await fetch(process.env.REACT_APP_BASE_API + "/api/fido-register/generate-registration-options", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "username": localStorage.getItem('username'),
      })
    });
    let { status, options } = await resp.json();
    options = JSON.parse(options);

    let regResp;
    try {
      regResp = await startRegistration(options);
    } catch (err) {
      setError(true)
      setErrorMessage("Registration failed. Please try again.")
      throw new Error(err);
    }

    const verificationResp = await fetch(
      process.env.REACT_APP_BASE_API + "/api/fido-register/verify-registration-response?username=" + localStorage.getItem('username') + '&app_id=' + window.appid + '&recovery_email=' + recMail,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(regResp),
      }
    );

    const verificationRespJSON = await verificationResp.json();
    if (verificationRespJSON.status === 'success') {
      console.log("Registration successful");
      console.log(verificationRespJSON);
      setError(false)
      localStorage.removeItem('username')
      const redirect = verificationRespJSON.redirect_url + '?code=' + verificationRespJSON.code + '&len=' + verificationRespJSON.nonce_len + '&mode=fido'
      window.location.href = redirect
    } else {
      console.log("Registration failed");
      console.log(verificationRespJSON);
      setError(true)
      setErrorMessage("Registration failed. Please try again.")
    }
  }

  const handleLogin = async (e) => {
    setError(false)
    const resp = await fetch(process.env.REACT_APP_BASE_API + "/api/fido-auth/generate-authentication-options", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "username": localStorage.getItem('username'),
      })
    })

    let { status, options } = await resp.json();
    options = JSON.parse(options);

    let authResp;
    try {
      authResp = await startAuthentication(options);
    } catch (err) {
      console.log(err);
      setError(true)
      setErrorMessage("Verification failed. Please try again.")
      throw new Error(err);
    }

    const verificationResp = await fetch(
      process.env.REACT_APP_BASE_API + "/api/fido-auth/verify-authentication-response/" + localStorage.getItem('username') + '/' + window.appid,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authResp),
      }
    );

    const verificationRespJSON = await verificationResp.json();
    const { verified, message } = verificationRespJSON;
    if (verified) {
      console.log("Authentication successful");
      console.log(verificationRespJSON);
      setError(false)
      localStorage.removeItem('username')
      const redirect = verificationRespJSON.redirect_url + '?code=' + verificationRespJSON.code + '&len=' + verificationRespJSON.nonce_len + '&mode=fido'
      window.location.href = redirect
    }
    else {
      console.log("Authentication failed");
      console.log(verificationRespJSON);
      setError(true)
      setErrorMessage("Verification failed. Please try again.")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(recMail)
  }


  const sendRecMail = async (e) => {
    e.preventDefault();
    console.log('sending mail')
    setSendingMail(true)
    const endpoint = process.env.REACT_APP_BASE_API + '/api/recover_create'
    let resp = await axios.post(endpoint, {
      'username': localStorage.getItem('username'),
      'method': 'fido',
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


  return (
    <div className='h-screen bg-black overflow-auto'>
      <AppNameComponent />
      {state === 'login' && <p className='font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>{id}</p>}
      {localStorage.getItem('username') && <p className='font-bold leading-tight tracking-tight text-gray-400 mb-8 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>Username : {localStorage.getItem('username')}</p>}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-[22em] bg-gray-800 p-2 py-5 mb-2 rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-center items-center">
          {state === 'signup' && <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 pb-4 md:text-3xl dark:text-white'>Register with FIDO</h1>}
          {state === 'login' && <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 pb-4 md:text-3xl dark:text-white'>Verify with FIDO</h1>}
          <form className='p-3 flex flex-col justify-center items-center'>
            <button
              onClick={state === 'login' ? handleLogin : handleRegister}
              type="button"
              data-te-ripple-init
              data-te-ripple-color="light"
              className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
              {state === 'login' ? 'Verify' : 'Register'}
            </button>
          </form>
          {error && <p className='text-red-500 m-6'>{errorMessage}</p>}
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

      </div>
      <div className='mt-10'>
        {state === 'signup' && <RecoveryComponent setRecMail={setRecMail} submission={handleSubmit} />}
      </div>

    </div>

  );
}

export default FidoComponent;
