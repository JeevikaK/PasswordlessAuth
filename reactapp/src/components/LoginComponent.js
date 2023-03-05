import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react'
import AppNameComponent from './AppNameComponent';

const LoginComponent = () => {

    const [id, setId] = useState('')
    const [username, setUsername] = useState('')
    let [state, setState] = useState('')
    let [login, setLogin] = useState('')
    let [signup, setSignup] = useState('')
    const navigate = useNavigate();

    window.appid = useParams().id
    state = useParams().state
    useEffect(() => {

        if(state == 'login')
            setLogin(true)
        if (state == 'signup')
            setSignup(true)
    })


    function voiceHandleClick() {
        let link = '/'.concat(window.appid).concat('/').concat(state).concat('/voice')
        navigate(link);
    }

    function videoHandleClick() {
        let link1 = '/'.concat(window.appid).concat('/').concat(state).concat('/video')
        navigate(link1);
    }

    function handleSubmitVoice(e){
        e.preventDefault()
        voiceHandleClick()
        localStorage.setItem('username', username)
    }

    function handleSubmitVideo(e){
        e.preventDefault()
        videoHandleClick()
        localStorage.setItem('username', username)
    }

    useEffect(() => {
        const link = 'http://127.0.0.1:8000/api/get_app/'.concat(window.appid)
        console.log(link)
        axios.get(link)
        .then((res) => {
            window.appname = res.data.app_name
            console.log(window.appname)
            setId(window.appname)
        })
        .catch((err) => console.log(err))
    },[])


    return ( 

        <div className="h-screen bg-black overflow-auto">
            <AppNameComponent />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-gray-800 rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-5">
                    {login && <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-400 md:text-2xl dark:text-white">
                        Login into your account
                    </h1>}
                    {signup && <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-400 md:text-2xl dark:text-white">
                        Create an Account
                    </h1>}
                    {login && <h6 className="text-xl font-bold leading-tight tracking-tight text-gray-400 md:text-xl dark:text-white">{ id }</h6>}
                        <form className="space-y-4 md:space-y-6" method='POST'>
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-200 dark:text-white py-3">Username</label>
                                <input type="username" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""></input>
                                <p className='text-red-500 text-sm mt-2 hidden'>Please fill this field!</p>
                                
                                <p className="text-sm font-medium pt-7 pb-4 text-gray-200">Biometric Verification</p>
                                <div className="flex justify-center space-x-2">
                                    <button
                                        type="submit"
                                        onClick={handleSubmitVideo}
                                        data-te-ripple-init
                                        data-te-ripple-color="light"
                                        className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                                        Facial Verification
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={handleSubmitVoice}
                                        data-te-ripple-init
                                        data-te-ripple-color="light"
                                        className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                                        Voice Verification
                                    </button>
                                </div>

                                <p className="text-sm font-medium pt-6 text-gray-200">Blockchain Verification</p>
                                <div className="flex justify-center space-x-2 py-4">
                                    <button
                                        type="submit"
                                        data-te-ripple-init
                                        data-te-ripple-color="light"
                                        className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                                        Authenticate
                                    </button>
                                </div>
                                <p className="text-sm font-medium text-gray-200 pb-3">FIDO Verification</p>
                                <div className="flex justify-center space-x-2">
                                    <button
                                        type="submit"
                                        data-te-ripple-init
                                        data-te-ripple-color="light"
                                        className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
                                        Authenticate
                                    </button>
                                </div>
                            </div>
                            {/* <button type="submit" className="w-full text-white bg-neutral-800 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button> */}
                            {login && <p className="text-sm font-light text-gray-200 dark:text-gray-400">
                                Don’t have an account yet? <a href={'/'+window.appid+'/signup'} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                            </p>}
                            {signup && <p className="text-sm font-light text-gray-200 dark:text-gray-400">
                                Have an account already? <a href={'/'+window.appid+'/login'} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</a>
                            </p>}
                        </form>
                    </div>
                </div>
            </div>
      </div>
     );
}
 
export default LoginComponent;