import VoiceRecordReregComponent from "../../components/reRegistrationComponents/VoiceRecordReregComponent";
import { useState } from 'react';
import REAuthComponent from "../../components/reRegistrationComponents/REAuthComponent";

const VoiceRecord_reReg = () => {
    const [type, setType] = useState('pre-auth');
    return ( 
        <>
            {type=='pre-auth' && <VoiceRecordReregComponent type={type} setType = {setType}></VoiceRecordReregComponent>}
            {type=='post-auth' && <REAuthComponent type={type} />}
        </>  
    );
}
 
export default VoiceRecord_reReg;