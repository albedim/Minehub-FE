import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils";
import { COLORS } from "../config";

export const Admin = () => {

  const [isLoggedIn, setIsLoggedId] = useState(false)

  const [roles, setRoles] = useState([])

  const [maintenance, setMaintenance] = useState(false)

  const [userAdmin, setUserAdmin] = useState({
    'username': '',
    'password': ''
  })

  const [userData, setUserData] = useState({
    'email': '',
    'role_id': 0
  })

  const [popupText, setPopupText] = useState("")

  const [popupSeverity, setPopupSeverity] = useState("")

  const [popupStatus, setPopupStatus] = useState(false)

  const admin = async () => {
    console.log(userAdmin)
    await axios.post(BASE_URL + '/user/admin', {
      'username': userAdmin.username,
      'password': userAdmin.password
    })
      .then(response => {
        setIsLoggedId(true)
      })
      .catch(error => {})
  }

  const handleUserAdmin = (e) => {
    const newUserAdmin = { ...userAdmin }
    newUserAdmin[e.target.name] = e.target.value
    setUserAdmin(newUserAdmin)
  }

  const handleUserData = (e) => {
    const newUserData = { ...userData }
    newUserData[e.target.name] = e.target.value
    setUserData(newUserData)
  }

  const changeRole = async () => {
    await axios.put(BASE_URL + '/user/change/role', {
      'email': userData.email,
      'role_id': parseInt(userData.role_id)
    })
      .then(response => {
        setPopupText("Ruolo cambiato correttamente")
        setPopupSeverity("green")
        setPopupStatus(true)
      })
      .catch(error => {
        setPopupText("Non esiste alcun utente con questa email")
        setPopupSeverity("red")
        setPopupStatus(true)
      })
  }

  const getMaintenance = async () => {
    await axios.get(BASE_URL + "/server/maintenance")
      .then(response => {
        setMaintenance(response.data.param)
      })
      .catch(error => {})
  }

  const getRoles = async () => {
    await axios.get(BASE_URL + "/role/get")
      .then(response => {
        setRoles(response.data)
      })
      .catch(error => {})
  }

  const setServerMaintenance = async (status) => {
    if (status != "null") {
      await axios.put(BASE_URL + "/server/maintenance/" + status)
        .then(response => {
          getMaintenance()
        })
        .catch(error => {})
    }
  }

  useEffect(() => {
    getMaintenance()
    getRoles()
  }, [])

  return (
    <div className="w-screen h-screen items-center justify-around flex">
      {
        isLoggedIn ? (
          <div className="items-center justify-around flex bg-[#242a33] h-screen w-screen">
            <div>
              <div style={{borderRadius: 4}} className="p-8 bg-[#2a313b]">
                <input style={{color: 'gray'}} className="p-2 bg-[#242a33]" name="email" onChange={(e) => handleUserData(e)} value={userData.email} placeholder="email dell'utente" />
                <select style={{color: 'gray'}} className="ml-4 p-2 bg-[#242a33]" name="role_id" onChange={(e) => handleUserData(e)} id="">
                  {
                    roles.map(role => (
                      <option key={role.role_id} value={role.role_id}>{role.role_label}</option>
                    ))
                  }
                </select>
                <div className="pt-4"><button style={{ backgroundColor: COLORS[0], borderRadius: 4, color: 'white', fontWeight: 540, fontFamily: 'League Spartan'}} className="p-2" onClick={(e) => changeRole()}>Cambia</button></div>
              </div>
              <div style={{borderRadius: 4}} className="flex mt-4 p-8 bg-[#2a313b]">
                <div className="items-center flex"><h4 style={{color: 'gray', fontFamily: 'League Spartan'}}>Manutenzione</h4></div>
                <select style={{borderRadius: 4, color: 'gray'}} className="ml-4 p-2 bg-[#242a33]" onChange={(e) => { setMaintenance(e.target.value); setServerMaintenance(e.target.value) }} name="" id="">
                  <option value="null"></option>
                  <option value="true">ON</option>
                  <option value="false">OFF</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="items-center justify-around flex bg-[#242a33] h-screen w-screen">
            <div style={{ width: 340, height: 384 }} className="bg-[#2a313b]">
              <div className="items-center justify-around flex p-8">
                <h2 style={{ fontFamily: 'League Spartan' }} className="font-bold text-2xl text-[#ffffff]">Accedi (Admin)</h2>
              </div>
              <div className="items-center justify-around flex">
                <div>
                  <div className="mt-2">
                    <h2 className="text-[#ffffff]" style={{ fontFamily: 'League Spartan' }}>Username</h2>
                    <input name="username" value={userAdmin.email} onChange={(e) => handleUserAdmin(e)} style={{ borderRadius: 5 }} className="p-1 bg-[#596270]" type="email" />
                  </div>
                  <div className="mt-4">
                    <h2 className="text-[#ffffff]" style={{ fontFamily: 'League Spartan' }}>Password</h2>
                    <input name="password" value={userAdmin.password} onChange={(e) => handleUserAdmin(e)} style={{ borderRadius: 5 }} className="p-1 bg-[#596270]" type="password" />
                  </div>
                </div>
              </div>
              {
                userAdmin.email == "" || userAdmin.password == "" ? (
                  <div className="mt-8 items-center justify-around flex">
                    <button style={{ backgroundColor: COLORS[0], borderRadius: 4, fontFamily: 'League Spartan' }} className="opacity-40 font-bold text-[#ffffff] pr-5 pl-5 p-3">ACCEDI</button>
                  </div>
                ) : (
                  <div className="mt-8 items-center justify-around flex">
                    <button onClick={(e) => admin()} style={{ backgroundColor: COLORS[0], borderRadius: 4, fontFamily: 'League Spartan' }} className="font-bold text-[#ffffff] pr-5 pl-5 p-3">ACCEDI</button>
                  </div>
                )
              }
            </div>
          </div>
        )
      }
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={popupStatus} autoHideDuration={3000} onClose={() => setPopupStatus(false)}>
        <Alert style={{ fontFamily: 'League Spartan', color: 'white', backgroundColor: popupSeverity }} onClose={() => setPopupStatus(false)} severity="" sx={{ width: '100%' }}>
          {popupText}
        </Alert>
      </Snackbar>
    </div>
  );

}