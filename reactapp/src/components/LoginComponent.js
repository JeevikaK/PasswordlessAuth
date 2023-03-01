import { useNavigate } from 'react-router-dom';

const LoginComponent = () => {

    const navigate = useNavigate();

    function voiceHandleClick() {
        navigate('/voice');
    }

    return ( 

        <div className="h-screen bg-black from-gray-100 to-gray-300">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"></a>
                <div className="w-full bg-gray-800 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-5">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-400 md:text-2xl dark:text-white">
                            Login in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200 dark:text-white py-3">Username</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""></input>
                                
                                <p className="text-sm font-medium pt-4 pb-4 text-gray-200">Biometric Verification</p>
                                <div className="flex justify-center space-x-2">
                                    <button
                                        type="button"
                                        data-te-ripple-init
                                        data-te-ripple-color="light"
                                        className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                                        Facial 
                                    </button>
                                    <button
                                        type="button"
                                        onClick={voiceHandleClick}
                                        data-te-ripple-init
                                        data-te-ripple-color="light"
                                        className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                                        Voice Verification
                                    </button>
                                </div>

                                <p className="text-sm font-medium pt-6 text-gray-200">Blockchain Verification</p>
                                <div className="flex justify-center space-x-2 py-4">
                                    <button
                                        type="button"
                                        data-te-ripple-init
                                        data-te-ripple-color="light"
                                        className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                                        Click to Verify!
                                    </button>
                                </div>
                                <p className="text-sm font-medium text-gray-200 pb-3">FIDO Verification</p>
                                <div className="flex justify-center space-x-2">
                                    <button
                                        type="button"
                                        data-te-ripple-init
                                        data-te-ripple-color="light"
                                        className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)">
                                        Click to Verify!
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="w-full text-white bg-neutral-800 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                            <p className="text-sm font-light text-gray-200 dark:text-gray-400">
                                Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login up</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
      </div>
     );
}
 
export default LoginComponent;