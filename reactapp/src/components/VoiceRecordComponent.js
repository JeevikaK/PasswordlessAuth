import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'

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
    
    const handleSubmit = (e) => {
      e.preventDefault();
      const blobData = new Blob([audioBlob]);
      console.log(blobData)
      const formData = new FormData();
      formData.append('audio_file', blobData);
      console.log(formData)
      axios.post('http://127.0.0.1:8000/signup/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      .then((response) => console.log("im working"))
      .catch((err) => {console.log(err)
        console.log('err')
        console.log(formData)
        console.log(audioBlob)})
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
      <body>
        <form method='POST' onSubmit={handleSubmit}>
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
          <button type='submit'>Save</button>
        </form>
      </body>
    );
  }
 
export default VoiceRcordComponent;
