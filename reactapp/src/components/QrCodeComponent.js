import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeCanvas } from "qrcode.react";
import AppNameComponent from './AppNameComponent';
import axios from 'axios'
import RecoveryComponent from './recoveryComponent';

const CustomAlert = () => {
  const [id, setId] = useState('')
  const [url, setUrl] = useState("example.com");
  const [showAlert, setShowAlert] = useState(false);
  const [state, setState] = useState(useParams().state)
  const [recMail, setRecMail] = useState('');

  const navigate = useNavigate();

  window.appid = useParams().id

  useEffect(() => {
    if (localStorage.getItem('username') === null) {
      navigate('/'.concat(window.appid).concat('/login'))
    }
    const endpoint1 = process.env.REACT_APP_BASE_API + '/api/get_user/'.concat(localStorage.getItem('username'))
    axios.get(endpoint1)
      .then((res) => {
        // setUserMail(res.data.recovery_email)
        // console.log(res.data.inapp_auth)
        if((state=='signup' && res.data.userExists) || (state=='login' && !res.data.inapp_auth)){
          navigate('/'.concat(window.appid).concat('/signup'))
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

  const handleButtonClick = () => {
    let channel_id = Math.floor(Date.now()+Math.random())
    console.log(id)
    let endpoint = process.env.REACT_APP_BASE_API + '/'.concat(channel_id).concat('/').concat(window.appid).concat('/').concat(localStorage.getItem('username')).concat('/').concat(state).concat('/inapp')
    console.log(endpoint)
    setUrl(endpoint)
    console.log(url)
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(recMail)
  }

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      // value={url}
      value = 'http://127.0.0.1:8000/1680846608308/38e9c4108b74437081708105c34db694/anon/signup/inapp'
      size={300}
      bgColor={"#ffffff"}
      level={"H"}
    />
  );

  return (
    <div className='h-screen bg-black overflow-auto'>
      <AppNameComponent />
      {state === 'login' && <p className='font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>{id}</p>}
      {localStorage.getItem('username') && <p className='font-bold leading-tight tracking-tight text-gray-400 mb-8 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>Username : {localStorage.getItem('username')}</p>}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className=" bg-gray-800 px-10 py-6 mb-2 rounded-lg shadow dark:border md:mt-0 sm:max-w-md  dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-center items-center">
        <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-400 pr-4 text-center pt-4 pl-4 pb-4 md:text-3xl dark:text-white'>In-App Authentication</h1>
        {state === 'signup' && <button type='button'
            onClick={handleButtonClick}
            data-te-ripple-init
            data-te-ripple-color="light"
            className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 mt-6 mb-4 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
            Register
        </button>}
        {state === 'login' && <button type='button'
            onClick={handleButtonClick}
            data-te-ripple-init
            data-te-ripple-color="light"
            className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 mt-6 mb-4 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
            Verify
        </button>}
      {showAlert && (
        <div>
          <p className='font-bold text-slate-200 mb-3 text-center'>Scan QR Code through app to authenticate</p>
          <div className='flex justify-center border-8'>{qrcode}</div>
          <p className='text-sm leading-tight tracking-tight text-slate-200 mt-3 text-center'>Do not close the QR Code until authenticated</p>
          <div className='flex justify-center'>
            <button type='button'
                onClick={handleAlertClose}
                data-te-ripple-init
                data-te-ripple-color="light"
                className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 mt-6 mb-4 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
                Close
            </button>
          </div>
        </div>
      )}
      </div>
      </div>
      <div className='mt-10'>
        <RecoveryComponent setRecMail={setRecMail} submission={handleSubmit} />
      </div>
     
    </div>
  );
};

export default CustomAlert;