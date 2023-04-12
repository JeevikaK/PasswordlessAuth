import FidoReregComponent from "../../components/reRegistrationComponents/FidoReregComponent";
import React, { useState } from 'react';

const Fido_postReg = () => {
    const [type, setType] = useState('post-auth');
    return ( 
        <FidoReregComponent type={type} setType = {setType}></FidoReregComponent>
     );
}
 
export default Fido_postReg