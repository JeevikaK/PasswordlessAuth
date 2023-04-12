import InappReregComponent from "../../components/reRegistrationComponents/InappReregComponent";
import { useState } from "react";

const Inapp_Recovery = () => {
    const [type, setType] = useState('post-auth');
    const [recov, setRecov] = useState('recover');
    return ( 
        <InappReregComponent type={type} setType = {setType} recov={recov}></InappReregComponent>
     );
}
 
export default Inapp_Recovery