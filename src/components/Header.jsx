import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import Avatar from "boring-avatars";
import jwt from "jwt-decode";
import { useEffect, useState } from "react";
import { IonIcon } from "react-ion-icon";
import { useNavigate } from "react-router-dom";
import { BASE_URL, fixDate } from "../utils";
import { COLORS } from "../config";

export const Header = () => {

  const [profile, setProfile] = useState({
    "admin":"",
    "created_on":"",
    "email":"",
    "likes":0,
    "messages":0,
    "minecraft_username":"",
    "name":"",
    "questions":0, 
    "role_id": 0,
    "role": {},
    "user_id": 0
  })

  const [roles, setRoles] = useState([])

  const [profileToEdit, setProfileToEdit] = useState({
    "email": "",
    "minecraft_username": "",
    "name": ""
  })

  const [profileModalStatus, setProfileModalStatus] = useState(false)

  const [profileToEditModalStatus, setProfileToEditModalStatus] = useState(false)

  const navigate = useNavigate()

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    getIsLoggedIn()
    getRoles()
  },[])

  const getIsLoggedIn = () => {
    const token = window.localStorage.getItem("token")
    if(token == null){
      setIsLoggedIn(false)
    }else{
      axios.get(BASE_URL + '/user/session_check', { headers: {"Authorization" : 'Bearer ' + window.localStorage.getItem("token")} })
      .then(response => {
        setIsLoggedIn(true)
      })
      .catch(error => {
        setIsLoggedIn(false)
      })
    }
  }

  const handleProfileToEdit = (e) => {
    const newProfileToEdit = { ...profileToEdit }
    newProfileToEdit[e.target.name] = e.target.value
    setProfileToEdit(newProfileToEdit)
  }

  const changeData = async () => {
    await axios.put(BASE_URL + "/user/change", {
      'user_id': jwt(window.localStorage.getItem("token")).sub.user_id,
      'name': profileToEdit.name,
      'minecraft_username': profileToEdit.minecraft_username,
      "email": profileToEdit.email
    })
    .then((response) => {
      window.localStorage.setItem("token", response.data.param)
      setProfileModalStatus(false)
      setProfileToEditModalStatus(false)
    })
    .catch(error => {})
  }

  const getRoles = async () => {
    await axios.get(BASE_URL + "/role/get")
    .then((response) => {
      setRoles(response.data)
    })
    .catch(error => {})
  }

  return (
    <>
      <Modal
        open={profileModalStatus}
        onClose={() => setProfileModalStatus(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ outline: 'none', border: 'none', justifyContent: 'space-around', display: 'flex', borderRadius: 2, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, boxShadow: 24, pt: 2, px: 4, pb: 3, width: 400 }}>
          <div style={{ borderRadius: 8 }} className='bodyhome mt-4 flex p-10 bg-[#2a313b]'>
            <div>
              <div className='justify-around flex'>
                <div style={{ width: 94 }}>
                  <img style={{borderRadius: "50%"}} src={"data:image/png;base64," + window.localStorage.getItem("profile_image").substring(2,window.localStorage.getItem("profile_image").length - 1)}/>
                </div>
              </div>
              <div className=' mt-4 text-xl items-center justify-around flex' style={{ borderRadius: 5, backgroundColor: profile.role.color }}><h2 style={{ fontSize: 14, fontWeight: 600, fontFamily: 'League Spartan' }} className='text-[#ffffff]'>{profile.role.role_label}</h2></div>
            </div>
            <div className='pl-4'>
              <div className='pt-4 pl-6'>
                <h2 style={{ fontSize: 18, fontFamily: 'League Spartan' }} className='font-bold text-[#ffffff]'>{profile.minecraft_username}</h2>
                <h2 style={{ fontSize: 16, fontFamily: 'League Spartan' }} className='text-[#596270]'>{profile.name}</h2>
              </div>
              <div className='pt-1 pl-6'>
                <h2 style={{ fontSize: 14, fontFamily: 'League Spartan' }} className='font-bold text-[#596270]'>Membro dal {fixDate(profile.created_on)}</h2>
              </div>
              <div className='pl-6 pt-4 flex'>
                <div className='p-2'>
                  <h2 style={{ fontSize: 14, fontFamily: 'League Spartan' }} className='font-bold text-[#ffffff]'>Discussioni</h2>
                  <h2 style={{ textAlign: 'center', fontSize: 14, fontFamily: 'League Spartan' }} className='font-bold text-[#596270]'>{profile.questions}</h2>
                </div>
                <div className='p-2'>
                  <h2 style={{ fontSize: 14, fontFamily: 'League Spartan' }} className='font-bold text-[#ffffff]'>Messaggi</h2>
                  <h2 style={{ textAlign: 'center', fontSize: 14, fontFamily: 'League Spartan' }} className='font-bold text-[#596270]'>{profile.messages}</h2>
                </div>
              </div>
            </div>
            <div className="p-4 justify-around align-center flex">
              <div style={{color: COLORS[0], fontSize: 24, cursor: 'pointer' }} onClick={(e) => setProfileToEditModalStatus(true)}><IonIcon name='create'/></div>
            </div>
          </div>
        </Box>
      </Modal>
      <Modal
        open={profileToEditModalStatus}
        onClose={() => setProfileToEditModalStatus(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ outline: 'none', border: 'none', justifyContent: 'space-around', display: 'flex', borderRadius: 2, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, boxShadow: 24, pt: 2, px: 4, pb: 3, width: 400 }}>
          <div style={{ borderRadius: 8 }} className='mt-4 flex p-10 bg-[#2a313b]'>
            <div>
              <div className="mt-2">
                <h2 className="text-[#ffffff]" style={{fontFamily: 'League Spartan'}}>Cambia il tuo nome</h2>
                <input name="name" value={profileToEdit.name} onChange={(e) => handleProfileToEdit(e)} style={{borderRadius: 5}} className="p-1 bg-[#596270]" type="text" />
              </div>
              <div className="mt-2">
                <h2 className="text-[#ffffff]" style={{fontFamily: 'League Spartan'}}>Cambia il tuo nick minecraft</h2>
                <input name="minecraft_username" value={profileToEdit.minecraft_username} onChange={(e) => handleProfileToEdit(e)} style={{borderRadius: 5}} className="p-1 bg-[#596270]" type="text" />
              </div>
              <div className="mt-2">
                <h2 className="text-[#ffffff]" style={{fontFamily: 'League Spartan'}}>Cambia la tua email</h2>
                <input name="email" value={profileToEdit.email} onChange={(e) => handleProfileToEdit(e)} style={{borderRadius: 5}} className="p-1 bg-[#596270]" type="email" />
              </div>
              {
                profileToEdit.name == "" || 
                profileToEdit.minecraft_username == "" || 
                profileToEdit.email == "" ? (
                  <div>
                    <button style={{ backgroundColor: COLORS[0], color: 'white', fontFamily: 'League Spartan', borderRadius: 5 }} className='opacity-40 mt-4 p-3'>Modifica</button>
                  </div>
                ):(
                  <div>
                    <button onClick={(e) => changeData()} style={{ backgroundColor: COLORS[0], color: 'white', fontFamily: 'League Spartan', borderRadius: 5 }} className='mt-4 p-3'>Modifica</button>
                  </div>
                )
              }
            </div>
          </div>
        </Box>
      </Modal>
      <div style={{ height: 54 }}>
        <div style={{ height: 64 }} className="bg-opacity-5 backdrop-blur-sm w-screen bg-[#ffffff] justify-between flex fixed">
          <div style={{ width: 184 }} className="opacity-70 items-center justify-around flex"><img className="w-10" src="fightclub_7.png" alt="" /></div>
          {
            isLoggedIn ? (
              <div className="flex">
                <div onClick={(e) => {setProfile(jwt(window.localStorage.getItem("token")).sub); setProfileToEdit({'name': jwt(window.localStorage.getItem("token")).sub.name, "minecraft_username": jwt(window.localStorage.getItem("token")).sub.minecraft_username, "email": jwt(window.localStorage.getItem("token")).sub.email}); setProfileModalStatus(true)}} style={{cursor: 'pointer', width: 54 }} className="items-center flex">
                  <div style={{ width: 24 }}>
                    <img style={{borderRadius: "50%"}} src={"data:image/png;base64," + window.localStorage.getItem("profile_image").substring(2,window.localStorage.getItem("profile_image").length - 1)}/>
                  </div>
                </div>
                <div style={{ cursor: 'pointer', width: 124 }} onClick={(e) => { window.localStorage.removeItem("token"); navigate("/signin") }} className="text-[#ffffff] items-center flex"><span style={{ fontFamily: 'League Spartan' }}>Esci</span></div>
              </div>
            ) : (
              <div onClick={(e) => { navigate("/signin") }}  style={{ cursor: 'pointer', width: 240 }} className="text-[#ffffff] items-center justify-around flex">
                <span style={{ fontFamily: 'League Spartan' }}>Entra</span>
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}