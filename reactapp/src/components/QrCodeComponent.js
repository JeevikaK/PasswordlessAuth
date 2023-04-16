import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeCanvas } from "qrcode.react";
import AppNameComponent from './AppNameComponent';
import axios from 'axios'
import RecoveryComponent from './recoveryComponent';
import { w3cwebsocket as W3CWebSocket} from "websocket";

const CustomAlert = () => {
  const [id, setId] = useState('')
  const [url, setUrl] = useState("example.com");
  const [showAlert, setShowAlert] = useState(false);
  const [state, setState] = useState(useParams().state)
  const [recMail, setRecMail] = useState('');
  const [userMail, setUserMail] = useState('')
  const [sendingMail, setSendingMail] = useState(false)

  const navigate = useNavigate();

  window.appid = useParams().id

  useEffect(() => {
    if (localStorage.getItem('username') === null) {
      navigate('/'.concat(window.appid).concat('/login'))
    }
    const endpoint1 = process.env.REACT_APP_BASE_API + '/api/get_user/'.concat(localStorage.getItem('username'))
    axios.get(endpoint1)
      .then((res) => {
        setUserMail(res.data.recovery_email)
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

  const handleButtonClick = async() => {
    // let channel_id = Math.floor(Date.now()+Math.random())
    let channel_id = '1681415300217'
    // console.log(id)
    console.log(channel_id)
    let info = 'INAPP:'.concat(recMail) + ':'.concat(channel_id).concat(':').concat(window.appid).concat(':').concat(localStorage.getItem('username')).concat(':').concat(state).concat(':inapp')
    // info = process.env.REACT_APP_BASE_API + '/'.concat(recMail) + '/'.concat(channel_id).concat('/').concat(window.appid).concat('/').concat(localStorage.getItem('username')).concat(':').concat(state).concat(':inapp')
    setUrl(info)
    window.connection = new W3CWebSocket('ws://localhost:8000/ws/confirmation/' + channel_id + '/');
    setShowAlert(true);
    window.connection.onopen = () => {
      console.log('WebSocket Client Connected');
    }

    window.connection.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer) {
        console.log(dataFromServer)
        const json = dataFromServer.message
        console.log(json)
        if (json.status || json.verified) {
          console.log(json.status || json.verified)
          localStorage.removeItem('username')
          const redirect = json.redirect_url + '?code=' + json.code + '&len=' + json.nonce_len + '&mode=video'
          window.location.href = redirect
        }
      }
    };
  };

  // const testSocket = () => {
  //   console.log('test')
  //   window.connection.send(JSON.stringify({
  //     'type': 'chat_message',
  //     'message': {
  //       'name': 'test',
  //       'message': 'test'
  //     }
  //   }));
  // }

  const handleAlertClose = () => {
    window.connection.close()
    setShowAlert(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(recMail)
  }

  const sendRecMail = async (e) => {
    e.preventDefault();
    setSendingMail(true)
    console.log('sending mail')
    const endpoint = process.env.REACT_APP_BASE_API + '/api/recover_create'
    let resp = await axios.post(endpoint, {
      'username': localStorage.getItem('username'),
      'method': 'inapp',
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

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={url}
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
          {/* <button type='button' onClick={testSocket}>Test me!</button> */}
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

      {userMail != '' &&  <p className="text-sm text-center my-6 font-light text-gray-200 dark:text-gray-400" >
          Recover your account using email? 
          <br></br>
          {!sendingMail && <a href='' onClick={sendRecMail} className="font-medium text-primary-600 hover:underline cursor-pointer dark:text-primary-500">{userMail}</a>}
          <br />
          {sendingMail && <span>Sending...</span>}
          <br/>
          <span id='magicNotif' hidden={true}>Magic Link sent!</span>
          </p>}
      </div>
      </div>
      <div className='mt-10'>
        <RecoveryComponent setRecMail={setRecMail} submission={handleSubmit} />
      </div>
     
    </div>
  );
};

export default CustomAlert;