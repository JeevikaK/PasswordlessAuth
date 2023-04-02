import VoiceRecordReregComponent from "../../components/reRegistrationComponents/VoiceRecordReregComponent";
import { useState } from "react";

const VoiceRecord_Recovery = () => {
    const [type, setType] = useState('post-auth');
    const [recov, setRecov] = useState('recover');
    return ( 
        <VoiceRecordReregComponent type={type} setType = {setType} recov={recov}></VoiceRecordReregComponent>
     );
}
 
export default VoiceRecord_Recovery