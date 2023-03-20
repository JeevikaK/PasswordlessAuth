import REAuthComponent from "../../components/reRegistrationComponents/REAuthComponent";
import { useState } from "react";

const REAuthRoute = () => {
    const [type, setType] = useState('pre-auth');
    return (
    <>
        <REAuthComponent type={type}/>
    </>    
     );
}
 
export default REAuthRoute;