import React from 'react'
import { MDBProgress, MDBProgressBar } from 'mdb-react-ui-kit';
import { MDBBtn } from 'mdb-react-ui-kit';


export default function FileUploaad_Progress(props) {
  
  return (
     
    <div className='flex flex-col bg-white w-1/2 h-1/5 rounded-xl p-5 pt-10 drop-shadow-xl mt-16'>
      <p className=' overflow-ellipsis overflow-hidden'>Upoading {props.fileName}</p>

       <div className='h-1 w-full bg-gray-300 '>
            <div
                style={{ width: `${props.percent}%`}}
                className={`h-full bg-green-500`}>
            </div>
        </div>
  <p>{props.percent+'%'}</p>

    </div>
    
  )
}
