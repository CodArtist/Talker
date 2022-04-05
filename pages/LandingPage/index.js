import React, { useEffect, useState } from 'react'
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import Router from 'next/router'
import {FaLinkedin,FaGithub} from 'react-icons/fa'
// import { isMobile, browserName } from "react-device-detect";

// import useCheckMobileScreen from '../../components/Check_screen';

export default function LandingPage() {
  // const { data: session } = useSession()
  // const isMobile =useCheckMobileScreen();
  useEffect(() => {
  const securePage = async ()=>{
    const session1 =await getSession()
    if(session1){
     Router.push('/Chat')
    }
  }
  securePage()
  }, [])
  

 
//  if(typeof window !== 'undefined')
//   {if(session)
//   localStorage.setItem('session',true)
//   else
//   localStorage.setItem('session',false)
//   }
  return (
    <div className='flex flex-col items-center justify-center'>

    <div className='flex md:flex-row flex-col'>
      <div className='flex flex-col justify-center md:items-start items-center mb-20 md:mx-20 '>
    <h1 className='font-bold text-4xl mt-[3.5rem] mb-5'>Welcome to Talker</h1> 

  
     <p className=' text-sm font-sans'>Talk Anonymously with people near you<br></br>
     After signing in with your google account
     </p>
     <p className=' text-sm font-sans'>Made with &#10084;</p>
     </div>

     <div className='bg-gradient-to-r from-indigo-300 to-purple-400 md:w-[60rem] w-screen h-[25rem] md:h-[40rem] flex flex-col justify-center items-center'>
      <img src='https://www.pinclipart.com/picdir/big/567-5670745_social-media-illustration-png-clipart.png'/>
     </div>

     </div>



     <p className=' text-sm font-sans mt-[2rem]'>Developed by Harsh Jain </p>
     <div className='flex flex-row space-x-4 mt-4 mb-8'>
       <button><FaGithub/></button>
      
       <button><FaLinkedin/></button>
     </div>

    </div>
    // <div>
    //  { !session?(
    //   <button type='button' onClick={signIn}>SignIn</button>
    //  ):(
    //     <div></div>
      
    //  )
       
    //  }
    // </div>
  )
}
