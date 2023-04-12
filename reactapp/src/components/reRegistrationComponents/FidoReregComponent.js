import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import AppNameComponent from '../AppNameComponent';

const FidoComponent = ({type, setType, recov}) => {
  
  const navigate = useNavigate();
  const [id, setId] = useState('')
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [userMail, setUserMail] = useState('')
  const [recToken, setRecToken] = useState(useParams().token);


  window.appid = useParams().id

  useEffect(() => {

    console.log(type)
    if (localStorage.getItem('username') === null) {
      navigate('/'.concat(window.appid).concat('/re-register'))
    }

    const endpoint1 = process.env.REACT_APP_BASE_API + '/api/get_user/'.concat(localStorage.getItem('username'))
    axios.get(endpoint1)
      .then((res) => {
        setUserMail(res.data.recovery_email)
        if(type==='pre-auth'  && !res.data.fido_auth){
          navigate('/'.concat(window.appid).concat('/re-register'))
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
    let link = '/'.concat(window.appid).concat('/re-register')
    navigate(link);
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(false)
    let endpoint = ''

    if (recov === 'recover') {
      endpoint = process.env.REACT_APP_BASE_API + "/api/fido-register-recover/generate-registration-options"
    }
    else {
      endpoint = process.env.REACT_APP_BASE_API + "/api/fido-register/generate-registration-options"
    }
    
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "username": localStorage.getItem('username'),
        "recovery_token": recToken,
      })
    });
    let {status, options} = await resp.json();
    options = JSON.parse(options);

    let regResp;
    try {
      regResp = await startRegistration(options);
    } catch (err) {
      setError(true)
      setErrorMessage("Registration failed. Please try again.")
      throw new Error(err);
    }
    console.log("registration started")
    if(recov==='recover'){
        endpoint = process.env.REACT_APP_BASE_API + "/api/fido-register-recover/verify-registration-response?username="+localStorage.getItem('username')+'&app_id='+window.appid
    } else {
        endpoint = process.env.REACT_APP_BASE_API + "/api/fido-register/verify-registration-response?username="+localStorage.getItem('username')+'&app_id='+window.appid+'&recovery_email='+userMail
    }
    console.log(endpoint)
    const verificationResp = await fetch(
        endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(regResp),
      }
    );

    const verificationRespJSON = await verificationResp.json();
    if (verificationRespJSON.status==='success') {
      console.log(verificationRespJSON);
      setError(false)
      localStorage.removeItem('username')
      let link = '/'.concat(window.appid).concat('/login')
      navigate(link);
    } else {
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

    let {status, options} = await resp.json();
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
      process.env.REACT_APP_BASE_API + "/api/fido-auth-re_register/verify-authentication-response/"+localStorage.getItem('username') + '/' + window.appid,
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
      setType('post-auth')
    }
    else {
      console.log("Authentication failed");
      console.log(verificationRespJSON);
      setError(true)
      setErrorMessage(message)
    } 
  } 


  return (
    <div className='h-screen bg-black overflow-auto'>
      <AppNameComponent />
      {type === 'pre-auth' && <p className='font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>{id}</p>}
      {localStorage.getItem('username') && <p className='font-bold leading-tight tracking-tight text-gray-400 mb-8 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>Username : {localStorage.getItem('username')}</p>}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-[22em] bg-gray-800 p-2 py-5 mb-2 rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-center items-center">
          {type === 'post-auth' && <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 pb-4 md:text-3xl dark:text-white'>Register with FIDO</h1>}
          {type === 'pre-auth' && <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 pb-4 md:text-3xl dark:text-white'>Verify with FIDO</h1>}
          <form className='p-3 flex flex-col justify-center items-center'>  
            <button
            onClick = {type === 'pre-auth' ? handleLogin : handleRegister}
            type="button"
            data-te-ripple-init
            data-te-ripple-color="light"
            className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
              {type === 'pre-auth' ? 'Verify' : 'Register'}
            </button>
          </form>
          {error && <p className='text-red-500 m-6'>{errorMessage}</p>}
         
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
}

export default FidoComponent;
