import FidoReregComponent from "../../components/reRegistrationComponents/FidoReregComponent";
import { useState } from "react";

const Fido_Recovery = () => {
    const [type, setType] = useState('post-auth');
    const [recov, setRecov] = useState('recover');
    return ( 
        <FidoReregComponent type={type} setType = {setType} recov={recov}></FidoReregComponent>
     );
}
 
export default Fido_Recovery