import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeCanvas } from "qrcode.react";
import AppNameComponent from '../AppNameComponent';
import axios from 'axios'
// import RecoveryComponent from './recoveryComponent';
import { w3cwebsocket as W3CWebSocket, connection } from "websocket";

const CustomAlert = ({type, setType, recov}) => {
  const [id, setId] = useState('')
  const [url, setUrl] = useState("example.com");
  const [showAlert, setShowAlert] = useState(false);
  const [recToken, setRecToken] = useState(useParams().token);
  const [userMail, setUserMail] = useState('')
  const [error, setError] = useState(false)
  // const [recMail, setRecMail] = useState('');

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
        if(recov == undefined){
            if((type=='pre-auth'  && !res.data.inapp_auth) || (type=='post-auth' && res.data.inapp_auth)){
                navigate('/'.concat(window.appid).concat('/re-register'))
            }
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
    let channel_id = 1681415300217
    console.log(channel_id)
    console.log(id)
    if(type=='pre-auth')
        var state = 'login'
    else if(type=='post-auth')
        var state = 're-register'
    let info = 'INAPP::'.concat(channel_id).concat(':').concat(window.appid).concat(':').concat(localStorage.getItem('username')).concat(':').concat(state).concat(':inapp')
    // info = process.env.REACT_APP_BASE_API + '/'.concat(recMail) + '/'.concat(channel_id).concat('/').concat(window.appid).concat('/').concat(localStorage.getItem('username')).concat(':').concat(state).concat(':inapp')
    if(recov == 'recover'){
        info = 'INAPP:'.concat(recToken) + ':'.concat(channel_id).concat(':').concat(window.appid).concat(':').concat(localStorage.getItem('username')).concat(':recover').concat(':inapp')
    }
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
        if (json.verified || json.status) {
          console.log(json.verified, json.status)
          if(type=='pre-auth')
            setType('post-auth')
          else if(type=='post-auth'){
            navigate('/'.concat(window.appid).concat('/login'))
          }
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
      <div className="box">
          <div className="mdl">
              <div className="circles">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
            </div>  
          </div>
      </div>
      <AppNameComponent />
      {type === 'pre-auth' && <p className='fixed top-12 font-bold leading-tight tracking-tight text-gray-400 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>{id}</p>}
      {localStorage.getItem('username') && <p className='fixed top-20 font-bold leading-tight tracking-tight text-gray-400 mb-8 pr-4 pt-4 pl-4 md:text-xl dark:text-white'>Username : {localStorage.getItem('username')}</p>}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
      <div className=" mt-[10em] bg-zinc-800 opacity-90  dark:bg-zinc-800 dark:border-zinc-700 px-10 py-6 mb-2 rounded-lg shadow dark:border sm:max-w-md flex flex-col justify-center items-center">
        <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-400 pr-4 text-center pt-4 pl-4 pb-4 md:text-3xl dark:text-white'>In-App Authentication</h1>
        {type === 'post-auth' && <button type='button'
            onClick={handleButtonClick}
            data-te-ripple-init
            data-te-ripple-color="light"
            className="inline-block rounded  px-6 pt-2.5 pb-2 mt-6 mb-4 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
            Register
        </button>}
        {type === 'pre-auth' && <button type='button'
            onClick={handleButtonClick}
            data-te-ripple-init
            data-te-ripple-color="light"
            className="inline-block rounded  px-6 pt-2.5 pb-2 mt-6 mb-4 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
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
                className="inline-block rounded  px-6 pt-2.5 pb-2 mt-6 mb-4 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
                Close
            </button>
          </div>
        </div>
      )}
      </div>
      </div>
     
    </div>
  );
};

export default CustomAlert;