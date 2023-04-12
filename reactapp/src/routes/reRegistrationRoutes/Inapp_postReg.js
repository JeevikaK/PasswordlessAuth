import InappReregComponent from "../../components/reRegistrationComponents/InappReregComponent";
import React, { useState } from 'react';

const Inapp_postReg = () => {
    const [type, setType] = useState('post-auth');
    return ( 
        <InappReregComponent type={type} setType = {setType}></InappReregComponent>
     );
}
 
export default Inapp_postReg