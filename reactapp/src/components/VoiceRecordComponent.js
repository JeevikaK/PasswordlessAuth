import React, { useState, useEffect, useRef } from 'react';

const VoiceRcordComponent = () => {

    const [recorder, setRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
  
    useEffect(() => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        setRecorder(new MediaRecorder(stream));
      });
    }, []);
  
    const startRecording = () => {
      setIsRecording(true);
      setIsPlaying(false);
      recorder.start();
    };
  
    const stopRecording = () => {
      setIsRecording(false);
      recorder.stop();
    };
  
    const recordAgain = () => {
      setAudioBlob(null);
      setAudioUrl(null);
    };
  
    const handleDataAvailable = (event) => {
      setAudioBlob(event.data);
      setAudioUrl(URL.createObjectURL(event.data));
    };
  
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
      <div>
        {audioUrl && (
          <div>
            <audio src={audioUrl} controls />
          </div>
        )}
        {!audioUrl && (
          <button onClick={startRecording} disabled={isRecording}>
            {isRecording ? 'Recording...' : 'Start Recording'}
          </button>
        )}
        {isRecording && (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
        {audioUrl && (
          <button onClick={recordAgain}>Record Again</button>
        )}
      </div>
    );
  }
 
export default VoiceRcordComponent;
