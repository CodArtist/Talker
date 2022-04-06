import React, { useEffect, useState } from 'react'
const { io } = require("socket.io-client");
import axios from "axios";
import FormData from 'form-data'


import { getSession } from "next-auth/react"
import Router from 'next/router'

const ServerURL = "https://talker-server.herokuapp.com";

const socket = io.connect(ServerURL);
export default function Chat() {
 
    const [message, setmessage] = useState("")
    const [chats, setchats] = useState([])
    const [location, setlocation] = useState("")
    const [file, setfile] = useState(null)

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
   
     function handleUpload(e) {
      
      
        let formData = new FormData();
      
        //Adding files to the formdata
        formData.append("file", file);
        formData.append("room_id", location);
        for (var key of formData.entries()) {
          console.log(key[0] + ', ' + key[1])
        }
        axios({
          // Endpoint to send files
          url: `${ServerURL}/upload`,
          method: "POST",
          // Attaching the form data
          data: formData,
        })
          .then((res) => {
            console.log(res.data.path)
            socket.emit("sendFile",{filePath:res.data.path,location:location,file_name:res.data.file_name})
           }) // Handle the response from backend here
          .catch((err) => {
            console.log(err);
           }); // Catch errors if any
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
         
             navigator.geolocation.getCurrentPosition(success);
            } else if (result.state === "prompt") {
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
      socket.on("sendFile",data=>{
        
        setchats([...chats,{path:data.path,file_name:data.file_name}])
        console.log(chats)
        
    })
 
    })
    
  
  return (
    <div className='flex flex-col items-center h-screen bg-white space-y-8 mt-8'>
      
      
      <div className='flex flex-col h-3/5 bg-white w-screen overflow-scroll overflow-x-hidden items-center space-y-6 '>
       {
           chats.map((e)=>{
              if(typeof e === "string")
               return(
               <div key={e} className='from-purple-600 to-pink-400 bg-gradient-to-r w-1/2 rounded-lg items-start drop-shadow-xl whitespace-pre-wrap' >
                   <div className='text-white mx-10 font-sans my-3 whitespace-pre-wrap break-words'>{e}
                   </div>
                   </div>
               )

               return(
                <div key={e.path} className='from-purple-600 to-pink-400 bg-gradient-to-r w-1/2 rounded-lg items-start drop-shadow-xl whitespace-pre-wrap' >
                <div className='text-white mx-10 font-sans my-3 whitespace-pre-wrap break-words'>
                  <a target={'_blank'} href={`${ServerURL}/download?path=${e.path}`}>{e.file_name}</a>
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
     <form>
     <input className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10 my-3'  type="file"
        //To select multiple files
          onChange={(e) => {setfile(e.target.files[0])
          console.log(e.target.files[0])}}/>
</form>
<button onClick={(e) =>handleUpload(e)}
        >Send Files</button>
      </div>

  )
}