import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils";
import { COLORS } from "../config";

export const CreatePassword = () => {

  const [password,setPassword] = useState("")

  const navigate = useNavigate()

  const [popupStatus, setPopupStatus] = useState(false)

  const [popupText, setPopupText] = useState("")

  const [popupSeverity, setPopupSeverity] = useState("")

  const token = new URLSearchParams(useLocation().search).get("token") 
  
  const [userId, setUserId] = useState(0)

  const checkToken = async () => {
    await axios.get(BASE_URL + '/user/password_forgotten_token/' + token)
    .then(response => {
      setUserId(response.data.param)
    })
    .catch(error => navigate("/signin"))
  }

  useEffect(() => {
    checkToken()
  })

  const changePassword = async () => {
    await axios.put(BASE_URL + '/user/change_password', {
      'user_id': userId,
      'new_password': password
    })
    .then(response => {
      setPopupSeverity("green")
      setPopupText("Hai cambiato con successo la tua passwod")
      setPopupStatus(true)
      setTimeout(() => { navigate("/signin") }, 1000);
    })
    .catch(error => console.log(error))
  }

  return(
    <div className="items-center justify-around flex bg-[#242a33] h-screen w-screen">
      <div style={{width: 340, height: 284}} className="bg-[#2a313b]">
        <div className="items-center justify-around flex p-8">
          <h2 style={{fontFamily: 'League Spartan'}} className="font-bold text-2xl text-[#ffffff]">Recupera account</h2>
        </div>
        <div className="items-center justify-around flex">
          <div>
            <div className="mt-2">
              <h2 className="text-[#ffffff]" style={{fontFamily: 'League Spartan'}}>Password</h2>
              <input name="email" value={password} onChange={(e) => setPassword(e.target.value)} style={{borderRadius: 5}} className="p-1 bg-[#596270]" type="password" />
            </div>
          </div>
        </div>
        {
          password == "" ? (
            <div className="mt-10 items-center justify-around flex">
              <button style={{borderRadius: 4, fontFamily: 'League Spartan'}} className={"opacity-40 font-bold text-[#ffffff] bg-["+COLORS[0]+"] pr-5 pl-5 p-3"}>CAMBIA</button>
            </div>
          ):(
            <div className="mt-10 items-center justify-around flex">
              <button onClick={(e) => changePassword()} style={{borderRadius: 4, fontFamily: 'League Spartan'}} className={"font-bold text-[#ffffff] bg-["+COLORS[0]+"] pr-5 pl-5 p-3"}>CAMBIA</button>
            </div>
          )
        }
      </div>
      <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} open={popupStatus} autoHideDuration={3000} onClose={() => setPopupStatus(false)}>
        <Alert style={{fontFamily: 'League Spartan', color: 'white', backgroundColor: popupSeverity}} onClose={() => setPopupStatus(false)} severity={""} sx={{ width: '100%' }}>
          {popupText}
        </Alert>
      </Snackbar>
    </div>
  );
}