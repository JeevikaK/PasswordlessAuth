import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import AppNameComponent from './AppNameComponent';

const ECGComponent = () => {

  const navigate = useNavigate();
  const [id, setId] = useState('')
  const [state, setState] = useState(useParams().state)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [uploaded, setUploaded] = useState(false)
  const [current, setCurrent] = useState('')
  const [loading, setLoading] = useState(false)
  const [signal, setSignal] = useState(null)

  window.appid = useParams().id

  useEffect(() => {

    if (localStorage.getItem('username') === null) {
      navigate('/'.concat(window.appid).concat('/').concat(state))
    }

    const endpoint1 = process.env.REACT_APP_BASE_API + '/api/get_user/'.concat(localStorage.getItem('username'))
    axios.get(endpoint1)
      .then((res) => {
        if (state === 'login' && !res.data.userExists) {
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

  const handleLogin = async (e) => {
    setLoading(true)
    setError(false)
    setErrorMessage('')
    e.preventDefault();
    if (!uploaded) {
      setError(true)
      setErrorMessage('Please upload ECG wave')
      return
    }
    console.log('login')
    const endpoint = process.env.REACT_APP_BASE_API + 'api/login-ecg-auth'
    const formData = new FormData();
    formData.append('username', localStorage.getItem('username'))
    formData.append('ecg_image', signal)
    formData.append('app_id', window.appid)
    try {
      let response = await fetch(process.env.REACT_APP_BASE_API + '/api/login-ecg-auth', {
        method: 'POST',
        body: formData,
      })
      let json = await response.json();
      console.log(json)
      if (json.verified) {
        console.log('verified!')
        localStorage.removeItem('username')
        const redirect = json.redirect_url + '?code=' + json.code + '&len=' + json.nonce_len + '&mode=ecg'
        window.location.href = redirect
      }
      else {
        console.log('not verified!')
        setError(true)
        setErrorMessage("Verification failed! Please try again")
      }
    }
    catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const uploadECG = async (e) => {
    setSignal(e.target.files[0])
    const filename = e.target.files[0].name
    setErrorMessage('')
    setError(false)
    console.log(filename)
    if (filename.startsWith('owais')) {
      setUploaded(true)
      setCurrent(filename.split('.')[0]+'.png')
    }
    else if (filename.startsWith('prajwal')) {
      setUploaded(true)
      setCurrent(filename.split('.')[0]+'.png')
    }
    else {
      setUploaded(false)
      e.target.value = null
      setError(true)
      setErrorMessage('Invalid ECG wave')
    }
  }


  return (
    <div className='h-screen bg-black overflow-auto'>
      <div className="box">
        <div className="mdl">
          <div className="circles">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
          </div>
        </div>
      </div>
      <AppNameComponent />
      {state === 'login' && <p className='fixed top-12 font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>{id}</p>}
      {localStorage.getItem('username') && <p className='fixed top-20 font-bold leading-tight tracking-tight text-gray-400 mb-8 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>Username : {localStorage.getItem('username')}</p>}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className=" mt-[10em] bg-zinc-800 z-10  dark:bg-zinc-800 dark:border-zinc-700 p-2 py-5 mb-2 rounded-lg shadow dark:border sm:max-w-md flex flex-col justify-center items-center">
          {state === 'signup' && <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 pb-4 md:text-3xl dark:text-white'>Register with ECG</h1>}
          {state === 'login' && <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 pb-4 md:text-3xl dark:text-white'>Verify with ECG</h1>}
          <form className='p-3 flex flex-col justify-center items-center'>
            {state === 'login' && <>
              <div className='p-4 pt-0 border'>
                <h2 className='font-regular leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 pb-4 text-xl '>{localStorage.getItem('username')}'s ECG wave</h2>
                <img src={process.env.REACT_APP_URL + "/images/prajwal.png"} />
              </div>
              {!uploaded &&
                <div className='bg-white p-4 rounded-md m-4'>
                  <input type="file" name="ecg" id="ecg" onChange={uploadECG} />
                </div>
              }
              {uploaded && <div className='p-4 pt-0 border'>
                <h2 className='font-regular leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 pb-4 text-xl '>Recieved ECG wave</h2>
                <img src={process.env.REACT_APP_URL + "/images/" + current} />
              </div>}
              {loading && <div className='p-4 pt-0'>
                <h2 className="inline-block rounded  px-6 pt-2.5 pb-2 mt-6 text-xs font-medium uppercase leading-normal text-gray-200 ">Verifying...</h2>
              </div>}
              {!loading && <button
                onClick={handleLogin}
                type="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                className="inline-block mt-4 rounded px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
                Verify
              </button>}
            </>}

            {state === 'signup' && <div>
              <h2 className='font-light leading-tight tracking-tight text-center text-gray-400 pr-4 pt-4 pl-4 pb-4 md:text-3xl dark:text-white'>Please connect your ECG Sensor</h2>
            </div>}
          </form>

          {error && <p className='text-red-500 m-6'>{errorMessage}</p>}

        </div>
        <div className='flex space-x-4'>
          <button type='button'
            onClick={goBack}
            data-te-ripple-init
            data-te-ripple-color="light"
            className="inline-block rounded z-10 bg-zinc-800 px-6 pt-2.5 pb-2 mt-6 mb-4 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
            Back
          </button>

        </div>

      </div>
    </div>

  );
}

export default ECGComponent;
