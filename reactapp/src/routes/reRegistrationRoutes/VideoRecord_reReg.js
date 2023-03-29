import VideoRecordReregComponent from "../../components/reRegistrationComponents/VideoRecordReregComponent";
import { useState } from 'react';
import REAuthComponent from "../../components/reRegistrationComponents/REAuthComponent";

const VideoRecord_reReg = () => {
    const [type, setType] = useState('pre-auth');
    return (
        <>
            {type=='pre-auth' && <VideoRecordReregComponent type={type} setType = {setType}></VideoRecordReregComponent>}
            {type=='post-auth' && <REAuthComponent type={type} />}
        </>
    );
}

export default VideoRecord_reReg;