import InappReregComponent from "../../components/reRegistrationComponents/InappReregComponent";
import { useState } from 'react';
import REAuthComponent from "../../components/reRegistrationComponents/REAuthComponent";

const Inapp_reReg = () => {
    const [type, setType] = useState('pre-auth');
    return ( 
        <>
            {type=='pre-auth' && <InappReregComponent type={type} setType = {setType}></InappReregComponent>}
            {type=='post-auth' && <REAuthComponent type={type} />}
        </>  
    );
}
 
export default Inapp_reReg;