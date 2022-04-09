import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
export default function Fetching_Location() {
  return (
<div className='flex flex-col items-center justify-center py-5'>
    <div className={'flex flex-col w-1/2 space-y-6'}>
     <Skeleton height={50}/>
     <Skeleton height={50}/>
     <Skeleton height={50}/>
     <Skeleton height={50}/>
      
        </div>
        </div>
  )
}
