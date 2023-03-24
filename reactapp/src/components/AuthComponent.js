import axios from 'axios';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react'
import AppNameComponent from './AppNameComponent';


const AuthComponent = () => {

    const [appName, setAppName] = useState('')
    const [username, setUsername] = useState('')
    const [state, setState] = useState(useParams().state)
    const navigate = useNavigate();
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')

    window.appid = useParams().id

    async function checkUser(username, state, authType){
        if (username === '') {
            setError(true)
            setErrorText('Please fill this field!')
            return false
        }
        else{
            const endpoint = process.env.REACT_APP_BASE_API + '/api/get_user/'.concat(username)
            let response = await axios.get(endpoint)
            switch(state){
                case 'login':
                    if(!response.data.userExists){
                        setError(true)
                        setErrorText('Username does not exist!')
                        return false
                    }
                    else{
                        if(!response.data.voice_auth && authType === 'voice'){
                            setError(true)
                            setErrorText('Voice authentication is not enabled for this user!')
                            return false
                        }
                        if(!response.data.face_auth && authType === 'face'){
                            setError(true)
                            setErrorText('Face authentication is not enabled for this user!')
                            return false
                        }
                    }
                
                    break
                case 'signup':
                    if(response.data.userExists){
                        setError(true)
                        setErrorText('Username already exists!')
                        return false
                    }
                    break
            }
        }
        return true
    }

    async function handleVoiceClick (e) {
        e.preventDefault()
        let status = await checkUser(username, state, 'voice')
        if(!status)
            return
        let voiceLink = '/'.concat(window.appid).concat('/').concat(state).concat('/voice')
        navigate(voiceLink);
        localStorage.setItem('username', username)
    }

    async function handleVideoClick(e) {
        e.preventDefault()
        let status = await checkUser(username, state, 'face')
        if(!status)
            return
        let vidLink = '/'.concat(window.appid).concat('/').concat(state).concat('/video')
        navigate(vidLink);
        localStorage.setItem('username', username)
    }

    useEffect(() => {
        const endpoint = process.env.REACT_APP_BASE_API + '/api/get_app/'.concat(window.appid)
        axios.get(endpoint)
            .then((res) => {
                window.appname = res.data.app_name
                setAppName(window.appname)
            })
            .catch((err) => console.log(err))
        
    }, [])

    // async function myFunc(){
    //     console.log('clicked')
    //     const endpoint = process.env.REACT_APP_BASE_API+'/api/generate-user-code?app_id='+window.appid+'&username=shades'
    //     let resp = await axios.get(endpoint)
    //     console.log(resp.data)
    //     const redirect = resp.data.redirect_url+'?code='+resp.data.code+'&len='+resp.data.nonce_len
    //     window.location.href = redirect
    // }


    return (
        <>
        <div className="h-screen bg-black overflow-auto">
            <AppNameComponent />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-gray-800 rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-5">
                        {state === 'login' && <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-400 md:text-2xl dark:text-white">
                            Login into your account
                        </h1>}
                        {state === 'signup' && <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-400 md:text-2xl dark:text-white">
                            Create an Account
                        </h1>}
                        {state === 'login' && <h6 className="text-xl font-bold leading-tight tracking-tight text-gray-400 md:text-xl dark:text-white">{appName}</h6>}
                        
                        {/* <button className='border border-gray-300' onClick={myFunc}> click me</button> */}
                        <form className="space-y-4 md:space-y-6" method='POST'>
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-200 dark:text-white py-3">Username</label>
                                <input name="username" id="username" value={username} onChange={(e) => {setUsername(e.target.value); setError(false)}} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""></input>
                                {error && <p className='text-red-500 text-sm mt-2'>{errorText}</p>}

                                <p className="text-sm font-medium pt-7 pb-4 text-gray-200">Biometric Verification</p>
                                <div className="flex justify-center space-x-2">
                                    <button
                                        type="submit"
                                        onClick={handleVideoClick}
                                        data-te-ripple-init
                                        data-te-ripple-color="light"
                                        className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                                        Facial Verification
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={handleVoiceClick}
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

                            {state === 'login' && <p className="text-sm font-light text-gray-200 dark:text-gray-400" >
                                Don’t have an account yet? <a href={'/'.concat(window.appid).concat('/signup')} className="font-medium text-primary-600 hover:underline cursor-pointer dark:text-primary-500">Sign up</a>
                            </p>}
                            {state === 'signup' && <p className="text-sm font-light text-gray-200 dark:text-gray-400" >
                                Have an account already? <a href={'/'.concat(window.appid).concat('/login')} className="font-medium text-primary-600 hover:underline cursor-pointer dark:text-primary-500">Login</a>
                            </p>}
                            <p className="text-sm font-light text-gray-200 dark:text-gray-400" >
                                Re-register a new authentication method? <a href={'/'.concat(window.appid).concat('/re-register')} className="font-medium text-primary-600 hover:underline cursor-pointer dark:text-primary-500">Re-register</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default AuthComponent;