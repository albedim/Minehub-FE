import { Box, Modal } from "@mui/material";
import axios from "axios";
import jwt from "jwt-decode";
import { useEffect, useState } from "react";
import { IonIcon } from "react-ion-icon";
import { useNavigate } from "react-router-dom";
import { BASE_URL, isLoggedIn } from "../utils";
import { Loading } from "./Loading";
import { COLORS } from "../config";

export const Forum = () => {

  const [categories, setCategories] = useState([])

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  const [modalStatus, setModalStatus] = useState(false)

  const [categoryName, setCategoryName] = useState("")

  const [categoryStatus, setCategoryStatus] = useState(false)

  const[categoryEditable, setCategoryEditable] = useState(true)

  const getCategories = async () => {
    await axios.get(BASE_URL + '/category/get')
      .then(response => {
        setCategories(response.data)
        setTimeout(() => { setIsLoading(false) }, 1000);
      })
      .catch(error => console.log(error))
  }

  useEffect(() => {
    getCategories()
  }, [])

  const navigate = useNavigate()

  const addCategory = async () => {
    await axios.post(BASE_URL + '/category/add', {
      'name': categoryName,
      'editable': categoryEditable,
      'private': categoryStatus
    })
    .then(response => {getCategories(); setModalStatus(false)})
    .catch(error => console.log(error))
  }

  useEffect(() => {
    getIsLoggedIn()
  })

  const getIsLoggedIn = () => {
    const token = window.localStorage.getItem("token")
    if(token == null){
      setIsLoggedIn(false)
    }else{
      axios.get(BASE_URL + '/user/session_check?jwt=' + window.localStorage.getItem("token"))
      .then(response => {
        setIsLoggedIn(true)
      })
      .catch(error => {
        setIsLoggedIn(false)
      })
    }
  }

  return (
    <div className="justify-around flex w-screen bg-[#242a33]">
      {
        isLoading ? (
          <Loading />
        ) : (
          <div className='justify-around w-screen bodyhome flex'>
            <Modal
              open={modalStatus}
              onClose={() => setModalStatus(false)}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box sx={{ justifyContent: 'space-around', display: 'flex', borderRadius: 2, backgroundColor: '#242a33', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, boxShadow: 24, pt: 2, px: 4, pb: 3, width: 400 }}>
                <div>
                  <div className='mt-4'>
                    <h2 style={{ fontFamily: 'League Spartan' }} className='text-[#ffffff]'>Nome della categoria</h2>
                    <input onChange={(e) => setCategoryName(e.target.value)} name='name' style={{ borderRadius: 10, height: 34, color: 'white', border: 'none', outline: 'none', backgroundColor: '#2a313b' }} className='bg-[gray]' type="text" />
                  </div>
                  <div className="mt-4">
                    <h2 style={{ fontFamily: 'League Spartan' }} className='text-[#ffffff]'>Privata</h2>
                    <input checked={categoryStatus} name="private" onChange={(e) => setCategoryStatus(!categoryStatus)} type="checkbox" />
                  </div>
                  <div className="mt-4">
                    <h2 style={{ fontFamily: 'League Spartan' }} className='text-[#ffffff]'>Modificabile dagli utenti</h2>
                    <input checked={categoryEditable} name="editable" onChange={(e) => setCategoryEditable(!categoryEditable)} type="checkbox" />
                  </div>
                  <div className='mt-4 justify-around flex'>
                    <button onClick={(e) => addCategory()} style={{ backgroundColor: COLORS[0], color: 'white', fontFamily: 'League Spartan', borderRadius: 5 }} className={"mt-4 p-3"}>Crea categoria</button>
                  </div>
                </div>
              </Box>
            </Modal>
            <div>
              <div style={{ maxWidth: 1040 }} className='pl-8 mt-14 pr-14'>
                <div style={{ borderRadius: 10, fontFamily: 'League Spartan', height: 64 }} className='pl-10 pr-10 font-bold flex items-center text-[#ffffff] bg-[#2a313b]'>
                  <IonIcon style={{ color: COLORS[0], fontSize: 18 }} name="chatbubbles" />
                  <h2 className='ml-4 text-xl'>Categorie</h2>
                </div>
                <div className='mt-4 p-10 bg-[#2a313b]'>
                  {
                    categories.map(category => (
                      <div onClick={(e) => navigate("/forum/" + category.category_id)} style={{ cursor: 'pointer', borderBottomWidth: 1, borderBottomColor: '#384554', height: 84 }} className="mt-4 justify-between items-center flex-block">
                        <div className="pr-4 pl-4 flex">
                          <div className="text-[#596270] text-2xl"><IonIcon name="chatbox" /></div>
                          <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: 'League Spartan' }} className='text-xl ml-4 text-[#ffffff]'>{category.name}</h2>
                        </div>
                        <div className="flex-none ml-14 flex">
                          <div className="pl-8 pr-8" style={{ textAlign: 'center' }}>
                            <h2 style={{ fontFamily: 'League Spartan' }} className="font-bold text-[#ffffff]">Messaggi</h2>
                            <h2 className="font-bold" style={{ fontFamily: 'League Spartan', color: '#596270' }}>{category.messages}</h2>
                          </div>
                          <div className="pr-8 pl-4" style={{ textAlign: 'center' }}>
                            <h2 style={{ fontFamily: 'League Spartan' }} className="font-bold text-[#ffffff]">Discussioni</h2>
                            <h2 className="font-bold" style={{ fontFamily: 'League Spartan', color: '#596270' }}>{category.questions}</h2>
                          </div>
                          <div className="items-center ml-4 text-2xl justify-around flex">
                            {
                              category.private ? (
                                <div style={{color: COLORS[0]}} className={"opacity-40"} ><IonIcon name="lock-closed" /></div>
                              ) : (
                                <div style={{color: COLORS[0]}}><IonIcon name="lock-open" /></div>
                              )
                            }
                          </div>
                        </div>
                        <div className="none-flex ml-14 flex">
                          <div className="flex">
                            <h2 style={{fontSize: 14, fontFamily: 'League Spartan' }} className="font-bold text-[#596270]">Messaggi:</h2>
                            <h2 className="font-bold" style={{fontSize: 14, fontFamily: 'League Spartan', color: '#596270' }}>{category.messages}</h2>
                          </div>
                          <div className="ml-4 flex">
                            <h2 style={{fontSize: 14, fontFamily: 'League Spartan' }} className="font-bold text-[#596270]">Discussioni:</h2>
                            <h2 className="font-bold" style={{fontSize: 14, fontFamily: 'League Spartan', color: '#596270' }}>{category.questions}</h2>
                          </div>
                          <div className="items-center ml-4 text-2xl justify-around flex">
                            {
                              category.private ? (
                                <div style={{color: COLORS[0], fontSize: 14}} className={"opacity-40"} ><IonIcon name="lock-closed" /></div>
                              ) : (
                                <div style={{color: COLORS[0], fontSize: 14}} ><IonIcon name="lock-open" /></div>
                              )
                            }
                          </div>
                        </div>
                      </div>
                    ))
                  }
                  {
                    isLoggedIn ? (
                      jwt(window.localStorage.getItem("token")).sub.admin &&
                      <div style={{ maxWidth: 1040 }} className='justify-around flex pl-8 mt-14 pr-14'>
                        <div onClick={(e) => setModalStatus(true)} style={{cursor: 'pointer', color: COLORS[0], fontSize: 34 }}><IonIcon name='add-circle' /></div>
                      </div>
                    ):(
                      <></>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}