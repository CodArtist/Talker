import React, { useEffect, useState } from 'react'
const { io } = require("socket.io-client");
import styles from '../chat.module.css'
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import Router from 'next/router'



const socket = io.connect("https://talker-server.herokuapp.com");
export default function Chat() {
    const [message, setmessage] = useState("")
    const [chats, setchats] = useState([])
    const [location, setlocation] = useState("")
    

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      function success(pos) {
        var crd = pos.coords;
        setlocation((crd.latitude.toFixed(3)).toString()+(crd.longitude.toFixed(3)).toString())
        console.log("Your current position is:");
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
      }
      
      function errors(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
   
      
    
  
      useEffect(() => {
        const securePage = async ()=>{
          const session1 =await getSession()
          if(!session1){
            Router.push("/LandingPage")
          }
        }
        securePage()
        }, [])

  useEffect(() => {
    console.log("useEffect")
    if (navigator.geolocation) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then(function (result) {
            if (result.state === "granted") {
              console.log(result.state);
              // alert("granted")
              //If granted then you can directly call your function here
             console.log("ddfdfd")
             navigator.geolocation.getCurrentPosition(success);
            } else if (result.state === "prompt") {
              console.log(result.state);
              // alert("prompt")
              navigator.geolocation.getCurrentPosition(success, errors, options);
            } else if (result.state === "denied") {
              
              //If denied then you have to show instructions to enable location
            }
            result.onchange = function () {
              console.log(result.state);
            };
          });
      } else {
        alert("Sorry Not available!");
      }
      socket.emit("join",{location:location})
      
  }, [location])
  
  
    useEffect(() => {
      socket.on("chat",data=>{
          console.log(data)
          console.log(location)
          setchats([...chats,data])
          console.log(chats)
          
      })
    })
    
  
  return (
    <div className='flex flex-col items-center h-screen bg-white space-y-8 mt-8'>
      
      
      <div className='flex flex-col h-3/5 bg-white w-screen overflow-scroll overflow-x-hidden items-center space-y-6 '>
       {
           chats.map((e)=>{
      
               return(
               <div key={e} className='from-purple-600 to-pink-400 bg-gradient-to-r w-1/2 rounded-lg items-start drop-shadow-xl whitespace-pre-wrap' >
                   <div className='text-white mx-10 font-sans my-3 whitespace-pre-wrap break-words'>{e}
                   </div>
                   </div>
               )
           })
      
       }
       </div>
      <form className='flex flex-row space-x-2' onSubmit={(e)=>{
          e.preventDefault()
          socket.emit("chat",{message,location:location})
          setmessage("")
      
      }}>
      <textarea placeholder='Write your message' className='border-solid border-2 border-indigo-600 w-auto rounded-full px-7 py-2' type='text' value={message} onChange={(e)=>{
      
          setmessage(e.target.value)
      
      }}/>
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10 my-3' type='submit'>Send</button>
      </form>
      </div>

  )
}