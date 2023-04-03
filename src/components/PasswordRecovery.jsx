import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils";
import { COLORS } from "../config";

export const PasswordRecovery = () => {

  const [email,setEmail] = useState("")

  const navigate = useNavigate()

  const [popupStatus, setPopupStatus] = useState(false)

  const [popupText, setPopupText] = useState("")

  const [popupSeverity, setPopupSeverity] = useState("")

  const sendToken = async () => {
    await axios.put(BASE_URL + '/user/password_forgotten_token/' + email)
    .then(response => {
      setPopupSeverity("green")
      setPopupText("Ti è stata inviata una email")
      setPopupStatus(true)
    })
    .catch(error => {
      setPopupSeverity("red")
      setPopupText("Non esiste alcun account con questa email")
      setPopupStatus(true)
    })
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
              <h2 className="text-[#ffffff]" style={{fontFamily: 'League Spartan'}}>E-mail</h2>
              <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{borderRadius: 5}} className="p-1 bg-[#596270]" type="text" />
            </div>
          </div>
        </div>
        {
          email == "" ? (
            <div className="mt-10 items-center justify-around flex">
              <button style={{borderRadius: 4, fontFamily: 'League Spartan'}} className={"opacity-40 font-bold text-[#ffffff] bg-["+COLORS[0]+"] pr-5 pl-5 p-3"}>AVANTI</button>
            </div>
          ):(
            <div className="mt-10 items-center justify-around flex">
              <button onClick={(e) => sendToken()} style={{borderRadius: 4, fontFamily: 'League Spartan'}} className={"font-bold text-[#ffffff] bg-["+COLORS[0]+"] pr-5 pl-5 p-3"}>AVANTI</button>
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