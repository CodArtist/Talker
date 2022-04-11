import Image from 'next/image'
import React from 'react'
import connectionTimed from '../public/connection_timed_out.gif'

export default function ConnectionTimedOut() {
  return (
    <div className='flex flex-col items-center h-screen w-screen mt-20'>
        <Image src={connectionTimed} height={200} width={200}/>
        <h1 className=' opacity-75'>Connection Timed Out</h1>
        <h1 className=' opacity-75 text-sm'>Try reloading the page</h1>

        </div>
  )
}
