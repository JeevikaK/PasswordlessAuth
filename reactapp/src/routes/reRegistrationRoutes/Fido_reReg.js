import FidoReregComponent from "../../components/reRegistrationComponents/FidoReregComponent";
import { useState } from 'react';
import REAuthComponent from "../../components/reRegistrationComponents/REAuthComponent";

const Fido_reReg = () => {
    const [type, setType] = useState('pre-auth');
    return ( 
        <>
            {type=='pre-auth' && <FidoReregComponent type={type} setType = {setType}></FidoReregComponent>}
            {type=='post-auth' && <REAuthComponent type={type} />}
        </>  
    );
}
 
export default Fido_reReg;