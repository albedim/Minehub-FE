import { Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IonIcon } from 'react-ion-icon';
import { BASE_URL } from '../utils';
import { Header } from './Header';
import './styles/index.css'
import { COLORS, DESCRIPTION, DISCORD, SERVER_IP, SERVER_NAME } from "../config";

export const Hero = () => {

  const [serverStats, setServerStats] = useState({})

  const [popupStatus, setPopupStatus] = useState(false)


  const getServerStats = () => {
    axios.get(BASE_URL + '/server/get')
    .then(response => {
      setServerStats(response.data)
    })
    .catch(error => {})
  }

  useEffect(() => {getServerStats()}, [])

  return(
    <div style={{height: 784}} className="w-screen bg-cover bg-center bg-[url('../wallpaper1.png')]">
      <Header/>
      <div className='items-center flex justify-center'>
        <div style={{padding: 54}} className=''>
          <div style={{padding: 18}} className='flex items-center'>
            <h1 style={{fontFamily: 'League Spartan'}} className='text-[#ffffff] text-6xl font-bold'>{SERVER_NAME}</h1>
          </div>
          <div style={{maxWidth: 740, padding: 18}}>
            <h4 style={{fontFamily: 'League Spartan'}} className='text-[#ffffff] text-xl'>{DESCRIPTION}</h4>
          </div>
          <div style={{padding: 18}}>
            <span style={{fontFamily: 'League Spartan'}} className='font-bold text-[#ffffff] text-xl'>Al momento ci sono <span style={{color: COLORS[0]}} >{serverStats.online_players}</span> utenti online sul nostro server</span>
          </div>
          <div className='flex' style={{padding: 18}}>
            <button onClick={async (e) => { await navigator.clipboard.writeText(SERVER_IP); setPopupStatus(true)}} style={{backgroundColor: COLORS[1], fontFamily: 'League Spartan', width: 140, borderRadius: 8, padding: 14}} className={"bg-opacity-70 font-bold mt-5 text-[#ffffff]"}>INIZIA</button>
            <button onClick={(e) => window.location.href = DISCORD} style={{color: COLORS[1], backgroundColor: COLORS[0], opacity: '70%', fontFamily: 'League Spartan', width: 140, borderRadius: 8, padding: 14}} className={"ml-6 font-bold mt-5"}>DISCORD</button>
          </div>
          <div style={{padding: 18}} className='flex'>
            <div className='mt-8'>
              <h2 className='text-5xl font-bold text-[#ffffff]' style={{fontFamily: 'League Spartan'}}>{serverStats.questions}</h2>
              <h2 className='mt-4 text-xl text-[#ffffff]' style={{fontFamily: 'League Spartan'}}>Discussioni</h2>
            </div>
            <div className='ml-14 mt-8'>
              <h2 className='text-5xl font-bold text-[#ffffff]' style={{fontFamily: 'League Spartan'}}>{serverStats.registered_users}</h2>
              <h2 className='mt-4 text-xl text-[#ffffff]' style={{fontFamily: 'League Spartan'}}>Utenti registrati</h2>
            </div>
          </div>
        </div>
        <div>
          <img style={{width: 434}} src="./fightclub_7.png" alt="" />
        </div>
      </div>
      <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} open={popupStatus} autoHideDuration={3000} onClose={() => setPopupStatus(false)}>
        <Alert style={{fontFamily: 'League Spartan', color: 'white', backgroundColor: 'green'}} onClose={() => setPopupStatus(false)} severity="" sx={{ width: '100%' }}>
          Indirizzo IP copiato con successo
        </Alert>
      </Snackbar>
    </div>
  );
}