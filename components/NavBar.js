import React from 'react'
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { Router } from 'next/router'


export default function NavBar() {
    const {data:session} = useSession()
  return (
    <div className='flex flex-row bg-white justify-between px-[2rem] py-3 drop-shadow-md'>
      {/* <h1 className="text-3xl font-bold bg-gradient-to-tr from-indigo-300 to-purple-400">Talker</h1> */}
     <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">Talker</h1>
    
     <div className=' hover:bg-gradient-to-br from-purple-600 to-pink-100 hover:text-white p-2 rounded-lg'>
        { !session? (<button  onClick={()=>signIn('google')}>
             <p className='font-bold'>Sign In</p></button>):
             (<button  onClick={()=>signOut()}>
             <p className='font-bold'>LogOut</p></button>)
}

     </div>
    </div>
  )
}
