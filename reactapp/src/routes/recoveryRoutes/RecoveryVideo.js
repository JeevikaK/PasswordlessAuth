import CameraRecordReregComponent from "../../components/reRegistrationComponents/CameraRecordReregComponent";
import { useState } from "react";

const VideoRecord_Recovery = () => {
    const [recov, setRecov] = useState('recover');
    return (
        <CameraRecordReregComponent recov={recov}></CameraRecordReregComponent>
    );
}

export default VideoRecord_Recovery;