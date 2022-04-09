import Image from 'next/image'
import React from 'react'
import lockIconUrl from '../public/lock_icon_url.PNG'

export default function Allow_Location_Prompt() {
  return (
    <div className='flex flex-col items-center mt-12 h-screen w-screen p-5 space-y-8' >
        <p className='text-sm'>Please allow location permission <br></br>
        Follow the steps to allow permission: <br></br>
        1. turn on your device location if using android/ios. <br></br>
        2. click on the lock icon on the address bar and allow location permission <br></br>
        </p>
        <Image src={lockIconUrl}/>
    </div>
  )
}
