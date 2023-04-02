import axios from 'axios';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react'
import AppNameComponent from '../AppNameComponent';


const REAuthComponent = ({type}) => {

    const [appName, setAppName] = useState('')
    const [username, setUsername] = useState(localStorage.getItem('username') || '')
    const navigate = useNavigate();
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')

    
    window.appid = useParams().id

    async function checkUser(username, type, authType){
        if (username === '') {
            setError(true)
            setErrorText('Please fill this field!')
            return false
        }
        else{
            const endpoint = process.env.REACT_APP_BASE_API + '/api/get_user/'.concat(username)
            let response = await axios.get(endpoint)
            console.log(response.data.voice_auth)
            console.log(authType)
            console.log(type)
            switch(type){
                case 'pre-auth':
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
                case 'post-auth':
                    if(authType === 'voice' && response.data.voice_auth){
                        setError(true)
                        setErrorText('Voice authentication is already registered for this user!')
                        return false
                    }
                    if(authType === 'face' && response.data.face_auth){
                        setError(true)
                        setErrorText('Face authentication is already registered for this user!')
                        return false
                    }
                    break
            }
        }
        return true
    }

    async function handleVoiceClick (e) {
        e.preventDefault()
        let status = await checkUser(username, type, 'voice')
        console.log(status)
        if(!status)
            return
        if(type==='pre-auth'){   
            let voiceLink = '/'.concat(window.appid).concat('/pre-auth').concat('/voice')
            navigate(voiceLink);
        }
        else if(type==='post-auth'){
            let voiceLink = '/'.concat(window.appid).concat('/post-auth').concat('/voice')
            navigate(voiceLink);
        }
        localStorage.setItem('username', username)
    }

    async function handleVideoClick(e) {
        e.preventDefault()
        let status = await checkUser(username, type, 'face')
        if(!status)
            return
        if(type==='pre-auth'){
            let vidLink = '/'.concat(window.appid).concat('/pre-auth').concat('/video')
            navigate(vidLink);
        }
        else if(type==='post-auth'){
            let vidLink = '/'.concat(window.appid).concat('/post-auth').concat('/video')
            navigate(vidLink);
        }
        
        localStorage.setItem('username', username)
    }

    useEffect(() => {
        console.log(username)
        const endpoint = process.env.REACT_APP_BASE_API + '/api/get_app/'.concat(window.appid)
        axios.get(endpoint)
            .then((res) => {
                window.appname = res.data.app_name
                setAppName(window.appname)
            })
            .catch((err) => console.log(err))
        
    }, [])


    return (
        <>
        <div className="h-screen bg-black overflow-auto">
            <AppNameComponent />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-gray-800 rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-5">
                        {type === 'pre-auth' && <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-400 md:text-2xl dark:text-white">
                            Login into your account first!
                        </h1>}
                        {type === 'post-auth' && <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-400 md:text-2xl dark:text-white">
                            Register new Authentication Method!
                        </h1>}
                        <form className="space-y-4 md:space-y-6" method='POST'>
                            <div>

                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-200 dark:text-white py-3">Username</label>
                                { type==='pre-auth' && <input name="username" id="username" value={username} onChange={(e) => {setUsername(e.target.value); setError(false)}} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""></input>}
                                { type==='post-auth' && <input name="username" id="username" value={username}  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  required="" readOnly></input>}
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

                                
                                <p className="text-sm font-medium text-gray-200 pt-7 pb-3">FIDO Verification</p>
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

                            <p className="text-sm font-light text-gray-200 dark:text-gray-400" >
                                Don’t have an account yet? <a href={'/'.concat(window.appid).concat('/signup')} className="font-medium text-primary-600 hover:underline cursor-pointer dark:text-primary-500">Sign up</a>
                            </p>
                         
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default REAuthComponent;