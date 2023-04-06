import React, { useState } from 'react';
import Modal from 'react-modal';
import { QRCodeCanvas } from "qrcode.react";
import { useParams } from 'react-router-dom';

const AlertComponent = ({ imageUrl, message }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [url, setUrl] = useState("");

  const handleOpenModal = () => {
    setModalIsOpen(true);
    console.log('open')
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    console.log('close')
  };
  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={url}
      size={280}
      bgColor={"#ffffff"}
      level={"H"}
    />
  );

    const customStyle = {
        content: {
            width: '20rem',
            height: '28em',
            background: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
            justifyConent: 'center',
            alignItems: 'center',
        },
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.60)'
        },
    }

  return (
    <div className='flex flex-col items-center justify-center'>
        <button type='button'
            data-te-ripple-init
            data-te-ripple-color="light"
            onClick={handleOpenModal}
            className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 mt-3 mb-4 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
            {message}
        </button>
        <div className='absolute left-25'>
          <Modal
              style={customStyle}
              ariaHideApp={false}
              isOpen={modalIsOpen}
              onRequestClose={handleCloseModal}
              contentLabel="QR Code"
          >
              <p className='font-bold leading-tight tracking-tight text-gray-800 mb-3'>Scan the QR Code using the app!</p>
              <div className='w-full'>{qrcode}</div>
              <p className='text-sm leading-tight tracking-tight text-slate-200 mt-3 text-center'>Do not close the window until authenticated</p>

                  <button type='button'
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  onClick={handleCloseModal}
                  className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 mt-6 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
                  Close
              </button>
          </Modal>
        </div>

    </div>
  );
};

export default AlertComponent;