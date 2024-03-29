const RecoveryComponent = ({submission, setRecMail, setRecPhone, setLoading, loading, loadingContent}) => {
    return ( 
        <div className="bg-black">
            
            <div className="flex flex-col items-center justify-center mb-5 opacity-90 bg-zinc-800 w-2/3 px-6 mx-auto rounded-lg">
                <form method='POST' className="p-6 w-full" id="recovery">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200 dark:text-white py-3" >Enter Recovery Mail ID (Optional)</label>
                    <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="name@company.com" required="" onChange={(e) => {setRecMail(e.target.value) }}></input>
                    {/* <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-200 dark:text-white py-3">Enter Recovery Phone Number (Optional)</label>
                    <input name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="+91 XXXXXX" required="" onChange={(e) => {setRecPhone(e.target.value) }}></input> */}
                    <div className="flex flex-col justify-center items-center mt-5">
                        {!loading && <button
                            onClick={submission}
                            type="submit"
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            className="inline-block rounded bg-neutral-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-200 w-[5] shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                            Submit
                        </button>}

                        {loading && (
                            <div className="inline-block rounded bg-zinc-800 px-6 pt-2.5 pb-2 mt-6 text-xs font-medium uppercase leading-normal text-gray-200 ">
                            {loadingContent}...
                            </div>
                        )}
                    </div>

                </form>
            </div>
        </div>

     );
}
 
export default RecoveryComponent;