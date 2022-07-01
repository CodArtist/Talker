
import React, { useEffect, useState,useRef } from 'react'
const { io } = require("socket.io-client");
import axios from "axios";
import FormData from 'form-data'
import Image from 'next/image'
import noMessages from '../../public/noMessages.gif'
import {FaUpload,FaDownload} from 'react-icons/fa'


import { getSession } from "next-auth/react"
import Router from 'next/router'
import Fetching_Location from '../../components/Fetching_Location';
import Allow_Location_Prompt from '../../components/Allow_Location_Prompt';
import FileUploaad_Progress from '../../components/FileUploaad_Progress';
import ConnectionTimedOut from '../../components/ConnectionTimedOut';

const ServerURL = "https://talker-server.herokuapp.com";
// const ServerURL = "http://localhost:3001";

const socket = io.connect(ServerURL);
export default function Chat() {
 
    const [message, setmessage] = useState("")
    const [chats, setchats] = useState([])
    const [location, setlocation] = useState("")
    const [file, setfile] = useState(null)
    const [locationLoading, setlocationLoading] = useState(true)
    const [locationPermission, setlocationPermission] = useState(false)
    const [fileUploading, setfileUploading] = useState(false)
    const [UploadPercent, setUploadPercent] = useState(0)
    const [roomName, setroomName] = useState("")
    const [Name, setName] = useState("")
    const [connectionTimedOut, setconnectionTimedOut] = useState(false)
    const [onlineUsers, setonlineUsers] = useState(0)
    const [typing, settyping] = useState('')

    const fileInput = useRef();
    
    const selectFile = () => {
        fileInput.current.click();
    }

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      function success(pos) {

        var crd = pos.coords;
        setlocation((crd.latitude).toString()+'_'+(crd.longitude).toString())
        setTimeout(function () {
          setlocationPermission(true)
          // setlocationLoading(false)

        }, 2000);
       
       
        console.log("Your current position is:");
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
      }
      
      function errors(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
   
     function handleUpload(e) {
      setfileUploading(true)
      const onUploadProgress = (event) => {
        const percentage = Math.round((100 * event.loaded) / event.total);
        console.log(percentage);
    
        setUploadPercent(percentage)
      };
        let formData = new FormData();
      
        //Adding files to the formdata
        formData.append("file", file);
        formData.append("room_id", roomName);
        for (var key of formData.entries()) {
          console.log(key[0] + ', ' + key[1])
        }
        axios.post(`${ServerURL}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress,
        })
          .then((res) => {
           

            socket.emit("chat",{data:{path:res.data.path,file_name:res.data.file_name,userName:Name}})
            setTimeout(()=>{
              setfileUploading(false)
              setUploadPercent(0)
            },1000)
            
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
    if (navigator.geolocation) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then(function (result) {
            if (result.state === "granted") {
             navigator.geolocation.watchPosition(function (position) {
               alert("i'm tracking you!"+ position.toString());
            },

            function (error) {
               if (error.code == error.PERMISSION_DENIED){
                  alert("you denied me :-(");
               }
            });
             navigator.geolocation.getCurrentPosition(success);
            } else if (result.state === "prompt") {
              navigator.geolocation.getCurrentPosition(success, errors, options);
            } else if (result.state === "denied") {
              setTimeout(function () {
                setlocationLoading(false)
                setlocationPermission(false)
              }, 2000);
              //If denied then you have to show instructions to enable location
            }
            result.onchange = function () {
              console.log(result.state);
              if (result.state === "granted") {
                
                setlocationLoading(true)
                navigator.geolocation.getCurrentPosition(success);
               }
               else if (result.state === "denied") {
                console.log('denied')
                setTimeout(function () {
                  setlocationLoading(false)
                  setlocationPermission(false)
                }, 2000);
                
                //If denied then you have to show instructions to enable location
              }
            };
          });
      } else {
        alert("Sorry your browser/device doesn't support location feature");
      }
      if(location!=''){
      socket.emit("join",{location:location})
      }else{
       setlocationLoading(false)
       setlocationPermission(false)
      }
  
  }, [location])
  useEffect(() => {
    console.log('harsh is genius')
    if(file!=null)
     handleUpload()
  }, [file])
  
  
    useEffect(() => {
      socket.on("chat",data=>{
   
        if(Array.isArray(data))
       { 

         setchats([...data,...chats])
        setTimeout(()=>{
          setlocationLoading(false)

        },2000)

       }
         else{ 
          setchats([data,...chats])
         }
          
      })
      socket.on("roomName",roomName=>{
         setroomName(roomName)
      })
      socket.on("disconnect",()=>{
       setconnectionTimedOut(true)
      })
      socket.on("onlineUsers",(data)=>{
       setonlineUsers(data)
      })
      socket.on("typing",(userName)=>{
        settyping(userName)
        setTimeout(()=>{
          settyping('')
        },4000)
      })

 
    })

  
    
    
  if(locationLoading)
  return <Fetching_Location/>
  if(!locationPermission)
  return <Allow_Location_Prompt/>
  if(fileUploading)
  return ( <div className='flex flex-row justify-center h-screen w-screen'>
    <FileUploaad_Progress percent={UploadPercent} fileName={file.file_name}/>
  
  </div>
  )
  if(connectionTimedOut)
  return <ConnectionTimedOut/>

  
  return (
    <div className='flex flex-col items-center h-[37rem] justify-between space-y-4'>

      <div className='flex flex-row justify-center items-center space-x-2 mt-4'>
      <div className=' text-sm'>{onlineUsers} online</div>
      <div className='h-2 w-2 rounded-full bg-green-500'></div>
      <div className=' opacity-20 text-sm'>{roomName}</div>
      </div>

      {typing!=''?(<div className='h-3 opacity-40 text-xs'>{typing} is typing...</div>):(<div className=' h-3 w-screen'></div>)}

      <div className='flex flex-col h-3/4 w-screen overflow-scroll overflow-x-hidden items-center space-y-6'>
       {
           chats.length!=0?(chats.map((e)=>{
   
            if(Object.keys(e).length===2)
               return(
               <div key={Math.random().toString()} className='from-purple-600 to-pink-400 bg-gradient-to-r w-1/2 rounded-lg items-start drop-shadow-xl whitespace-pre-wrap p-5' >
                   <div className='flex flex-row space-x-4'>
                   <div className=' bg-white rounded-full h-11 w-11 overflow-hidden'>
                     <img src={`https://avatars.dicebear.com/api/avataaars/${e.userName}.svg`}/>
                   </div>
                  <div className='  w-1/2 overflow-hidden overflow-ellipsis'>
                   <a className=' font-bold text-white'>{e.userName}</a>
                   </div>
                   </div>

                   <div className='text-white mx-10 font-sans my-3 whitespace-pre-wrap break-words'>{e.message}
                   </div>
                   </div>
               )

               return(
                <div key={Math.random().toString()} className='flex flex-col from-purple-600 to-pink-400 bg-gradient-to-r w-1/2 rounded-lg drop-shadow-xl whitespace-pre-wrap p-5 ' >
                     <div className='flex flex-row space-x-4'>
                   <div className=' bg-white rounded-full h-11 w-11 overflow-hidden'>
                     <img src={`https://avatars.dicebear.com/api/avataaars/${e.userName}.svg`}/>
                   </div>
                  <div className='  w-1/2 overflow-hidden overflow-ellipsis'>
                   <a className=' font-bold text-white'>{e.userName}</a>
                   </div>
                   </div>
                <div className='flex flex-row justify-between'>
                <div className='text-white w-1/2 font-sans my-3 whitespace-pre-wrap break-words'>
                  <a>{e.file_name}</a>
                </div>
                <a target={'_blank'} rel={'noreferrer'} href={`${ServerURL}/download?path=${e.path}`}>
                  <FaDownload color='white'/>
                </a>
                </div>
                
                </div>
           
               )
           })):(
             <div className='my-6'>
           <div className='flex flex-col justify-center items-center space-y-5 '>
            {/* <img src={require('../../public/favicon.ico')} alt="this slowpoke moves"  width="250" /> */}
            <Image src={noMessages} height={200} width={200}/>
            <h1 className=' text-gray-400'>No Messages Yet</h1>
           </div>
           </div>
           )

           
      
       }
       </div>
       {
      Name!=""?(<form className='flex flex-row space-x-2' onSubmit={(e)=>{
          e.preventDefault()
          socket.emit("chat",{data:{message:message,userName:Name}})
          setmessage("")
      
      }}>
      <textarea placeholder='Write your message' className='border-solid border-2 border-indigo-600 w-auto rounded-full px-7 py-2' type='text' value={message} onChange={(e)=>{
      
          setmessage(e.target.value)
          if(e.target.value.length%2===0)
          {setTimeout(()=>{
            socket.emit("typing",{userName:Name})

          },500)
        }
      
      }}/>
        <div className='mt-5' >
            <button onClick={selectFile} className='btn btn-primary' type='button' >
               <FaUpload/>
            </button>
      </div>
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10 my-3' type='submit'>Send</button>
    

     </form>):(<form onSubmit={(e)=>{
       e.preventDefault()
       setName(e.target[0].value)
      
     }}>
     <input placeholder='Write any Name' className='border-solid border-2 border-indigo-600 w-auto rounded-full px-7 py-2' type='text' onSubmit={(e)=>{
  
  }}/>
  <input type="submit" value="Submit" style={{"display":"none"}}/>
  </form>
  )
}
     <input className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10 my-3'  type="file"
       ref={fileInput} style={{ "display": "none" }}
          onChange={(e) => {setfile(e.target.files[0])
           
          }}/>

      </div>

  )
}
