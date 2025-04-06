import { Button } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [error, setError] = useState({
        email:'',
        psw:''
    })

    const emailRef=useRef();
    const pswRef=useRef();
    const navigate=useNavigate()

    const handleSubmit=(e)=>{
        e.preventDefault();
        const payload={
            email:emailRef.current.value,
            psw:pswRef.current.value,
        }
        console.log(payload)
        fetch('http://127.0.0.1:8000/api/login',{
            method:'POST',
            body:JSON.stringify(payload),
            headers:{
                "content-type": "application/json",
                    Accept: "application/json",
            }
        })
        .then(res=>res.json())
        .then(res=>{
            if(res.token){
                localStorage.setItem('login',res.token)
                navigate('importData')
            }
            else if(res.email){
                setError({...error,email:res.email})
            }
            else if(res.psw){
                setError({...error,psw:res.psw})
            }
        })
        .catch(err=>console.log(err))
    }

    useEffect(()=>{
        if(localStorage.getItem('login')){
            navigate('importData');
        }
    },[])

  return (
    <form className="max-w-md mx-auto mt-10 " onSubmit={handleSubmit}>
        <h2 style={{textAlign:'center',fontWeight:'bold',fontFamily:'sans-serif'}}>Se Connecter</h2>
        <div className="relative z-0 w-full mb-5 group">
            <input type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required  ref={emailRef}/>
            <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
            <p className="mt-2 text-sm text-red-600 dark:text-red-500"><span class="font-medium">{error.email!=='' && error.email}</span></p>
        </div>
        <div className="relative z-0 w-full mb-5 group">
            <input type="password" name="floating_password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required ref={pswRef}/>
            <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
            <p className="mt-2 text-sm text-red-600 dark:text-red-500"><span class="font-medium">{error.psw!=='' && error.psw}</span></p>
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
    </form>
  )
}
