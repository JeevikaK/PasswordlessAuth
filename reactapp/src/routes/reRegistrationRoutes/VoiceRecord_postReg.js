import VoiceRecordReregComponent from "../../components/reRegistrationComponents/VoiceRecordReregComponent";
import React, { useState } from 'react';

const VoiceRecord_postReg = () => {
    const [type, setType] = useState('post-auth');
    return ( 
        <VoiceRecordReregComponent type={type} setType = {setType}></VoiceRecordReregComponent>
     );
}
 
export default VoiceRecord_postReg