import React, { useRef, useEffect } from 'react';

const VideoRecordComponent = () => {
    const videoRef = useRef(null);

    useEffect(() => {
      async function setupVideoStream() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing user media:', error);
        }
      }
  
      setupVideoStream();
    }, []);
  
    return <video ref={videoRef} autoPlay muted playsInline />;
}
 
export default VideoRecordComponent;