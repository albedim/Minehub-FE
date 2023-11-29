import { Alert, Modal, Snackbar } from '@mui/material';
import axios from 'axios';
import Avatar from 'boring-avatars'
import { useEffect, useState } from 'react'
import { IonIcon } from 'react-ion-icon';
import { SpinnerCircular } from 'spinners-react';
import { BASE_URL, fixDate } from '../utils';
import './styles/index.css'
import './styles/style.css'
import jwt from 'jwt-decode'
import { Box } from '@mui/system';
import { Textarea } from '@mui/joy';
import { Loading } from './Loading';
import { COLORS } from "../config";

export const Home = () => {

  const [staffers, setStaffers] = useState([]);

  const [roles, setRoles] = useState([])

  const [recentUsers, setRecentUsers] = useState([])

  const [serverStats, setServerStats] = useState({})

  const [newses, setNewses] = useState([])

  const [profile, setProfile] = useState({
    "admin": "",
    "created_on": "",
    "email": "",
    "likes": 0,
    "messages": 0,
    "minecraft_username": "",
    "name": "",
    "questions": 0,
    "role_id": "",
    "role": {},
    "user_id": 0,
    "image": ""
  })

  const [isLoading, setIsLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [profileModalStatus, setProfileModalStatus] = useState(false)

  const [modalStatus, setModalStatus] = useState(false)

  const [isCreatingLoading, setIsCreatingLoading] = useState(false)

  const [news, setNews] = useState({
    'name': '',
    'body': ''
  })

  const handleNews = (e) => {
    const newNews = { ...news }
    newNews[e.target.name] = e.target.value
    setNews(newNews)
  }

  const getStaffers = async () => {
    await axios.get(BASE_URL + '/user/get/staffers')
      .then(response => { setStaffers(response.data); getRecentUsers() })
      .catch(error => { })
  }

  const getRecentUsers = () => {
    axios.get(BASE_URL + '/user/get/recent')
      .then(response => { setRecentUsers(response.data); getServerStats() })
      .catch(error => { })
  }

  const getRoles = async () => {
    await axios.get(BASE_URL + '/role/get')
      .then(response => { setRoles(response.data) })
      .catch(error => { })
  }

  useEffect(() => {
    getStaffers()
    getRoles()
  }, [])

  useEffect(() => {
    getIsLoggedIn()
  }, [])

  const getIsLoggedIn = () => {
    const token = window.localStorage.getItem("token")
    if (token == null) {
      setIsLoggedIn(false)
    } else {
      axios.get(BASE_URL + '/user/sync', { headers: { "Authorization": 'Bearer ' + window.localStorage.getItem("token") } })
        .then(response => {
          setIsLoggedIn(true)
        })
        .catch(error => {
          window.localStorage.setItem("token", error.response.data.error.token)
          window.localStorage.setItem("profile_image", error.response.data.error.image)
          setIsLoggedIn(true)
        })
    }
  }

  const getServerStats = () => {
    axios.get(BASE_URL + '/server/get')
      .then(response => {
        setServerStats(response.data)
        getNewses()
      })
      .catch(error => { })
  }

  const getNewses = () => {
    axios.get(BASE_URL + '/news/get')
      .then(response => {
        setNewses(response.data)
        setIsLoading(false)
      })
      .catch(error => { })
  }

  const addNews = () => {
    setIsCreatingLoading(true)
    axios.post(BASE_URL + '/news/add', {
      'title': news.name,
      'owner_id': jwt(window.localStorage.getItem("token")).sub.user_id,
      'body': news.body
    })
      .then(response => {
        getNewses()
        setModalStatus(false)
        setIsCreatingLoading(false)
      })
      .catch(error => { })
  }

  const setBanned = (userId, banned) => {
    axios.put(BASE_URL + '/user/ban', {
      'user_id': userId,
      'banned': banned
    })
      .then(response => {
        setProfileModalStatus(false)
      })
      .catch(error => { })
  }

  const removeNews = (newsId) => {
    axios.delete(BASE_URL + '/news/remove/' + newsId, { headers: { "Authorization": 'Bearer ' + window.localStorage.getItem("token") } })
      .then(response => {
        getNewses()
      })
      .catch(error => { })
  }

  return (
    <div className="justify-around flex w-screen bg-[#242a33]">
      {
        isLoading ? (
          <Loading />
        ) : (
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
                        <img style={{ borderRadius: "50%" }} src={"data:image/png;base64," + profile.image.substring(2, profile.image.length - 1)} />
                      </div>
                    </div>
                    <div className=' mt-4 text-xl items-center justify-around flex' style={{ borderRadius: 5, backgroundColor: profile.role.color }}><h2 style={{ fontSize: 14, fontWeight: 600, fontFamily: 'League Spartan' }} className='text-[#ffffff]'>{profile.role.role_label}</h2></div>
                    {
                      isLoggedIn ? (
                        jwt(window.localStorage.getItem("token")).sub.admin ? (
                          jwt(window.localStorage.getItem("token")).sub.user_id != profile.user_id ? (
                            profile.banned ? (
                              <div onClick={(e) => setBanned(profile.user_id, false)} className=' mt-4 text-xl items-center justify-around flex' style={{ cursor: 'pointer', borderColor: 'red', borderRadius: 5, borderWidth: 1 }}><h2 style={{ fontSize: 14, fontWeight: 600, fontFamily: 'League Spartan' }} className='text-[red]'>SBAN</h2></div>
                            ) : (
                              <div onClick={(e) => setBanned(profile.user_id, true)} className=' mt-4 text-xl items-center justify-around flex' style={{ cursor: 'pointer', borderRadius: 5, backgroundColor: 'red' }}><h2 style={{ fontSize: 14, fontWeight: 600, fontFamily: 'League Spartan' }} className='text-[#ffffff]'>BAN</h2></div>
                            )
                          ) : (
                            <></>
                          )
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )
                    }
                  </div>
                  <div className='block-none pl-4'>
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
                  <div className='none-block pl-4'>
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
                </div>
              </Box>
            </Modal>
            <Modal
              open={modalStatus}
              onClose={() => setModalStatus(false)}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box sx={{ justifyContent: 'space-around', display: 'flex', borderRadius: 2, backgroundColor: '#242a33', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, boxShadow: 24, pt: 2, px: 4, pb: 3, width: 400 }}>
                <div>
                  <div className='mt-4'>
                    <h2 style={{ fontFamily: 'League Spartan' }} className='text-[#ffffff]'>Nome della news</h2>
                    <input onChange={(e) => handleNews(e)} name='name' style={{ borderRadius: 10, height: 34, color: 'white', border: 'none', outline: 'none', backgroundColor: '#2a313b' }} className='bg-[gray]' type="text" />
                  </div>
                  <div className='mt-4'>
                    <h2 style={{ fontFamily: 'League Spartan' }} className='text-[#ffffff]'>Corpo della news</h2>
                    <Textarea
                      disabled={false}
                      value={news.body}
                      minRows={2}
                      name="body"
                      onChange={(e) => handleNews(e)}
                      maxRows={4}
                      style={{ color: 'white', border: 'none', outline: 'none', backgroundColor: '#2a313b' }}
                    />
                    <div className='mt-14 justify-around flex'>
                      {
                        news.name == "" || news.body == "" ? (
                          <button style={{ backgroundColor: COLORS[0], color: 'white', fontFamily: 'League Spartan', borderRadius: 5 }} className={"opacity-40 mt-4 p-3"}>Crea news</button>
                        ) : (
                          isCreatingLoading ? (
                            <button style={{ backgroundColor: COLORS[0], color: 'white', fontFamily: 'League Spartan', borderRadius: 5 }} className={"mt-4 p-3"}>
                              <SpinnerCircular thickness={158} speed={284} color="white" size={24} enabled={true} />
                            </button>
                          ) : (
                            <button onClick={(e) => addNews()} style={{ backgroundColor: COLORS[0], color: 'white', fontFamily: 'League Spartan', borderRadius: 5 }} className={"mt-4 p-3"}>Crea news</button>
                          )
                        )
                      }
                    </div>
                  </div>
                </div>
              </Box>
            </Modal>
            <div className='mobile-w-screen justify-around bodyhome flex'>
              <div>
                <div style={{ maxWidth: 1040 }} className='pl-8 mt-14 pr-14'>
                  <div style={{ borderRadius: 10, fontFamily: 'League Spartan', height: 64 }} className='justify-between pl-10 pr-10 font-bold flex items-center text-[#ffffff] bg-[#2a313b]'>
                    <div className='flex'>
                      <IonIcon style={{ color: COLORS[0], fontSize: 18 }} name="newspaper" />
                      <h2 className='ml-4 text-xl'>News</h2>
                    </div>
                    {
                      isLoggedIn ? (
                        jwt(window.localStorage.getItem("token")).sub.admin &&
                        <div style={{ height: 64 }} className='items-center justify-around flex'>
                          <div className='justify-around items-center flex' onClick={(e) => setModalStatus(true)} style={{ cursor: 'pointer', color: COLORS[0], fontSize: 24 }}><IonIcon name='add-circle' /></div>
                        </div>
                      ) : (
                        <></>
                      )
                    }
                  </div>
                </div>
                {
                  newses.map(iterationNews => (
                    <div key={iterationNews.news_id} style={{ maxWidth: 1040 }} className='pl-8 mt-10 pr-14'>
                      <div style={{ borderRadius: 8, fontFamily: 'League Spartan', height: 64 }} className='pl-10 pr-10 font-bold flex items-center text-[#ffffff] bg-[#2a313b]'>
                        <div>
                          <h2>{iterationNews.title}</h2>
                          <h2 className='text-[#596270]'>{fixDate(iterationNews.created_on)}</h2>
                        </div>
                      </div>
                      <div style={{ borderRadius: 8 }} className='justify-between bodyhome mt-4 p-10 flex bg-[#2a313b]'>
                        <div className='flex'>
                          <div style={{ cursor: 'pointer' }} onClick={(e) => { setProfile(iterationNews.owner); setProfileModalStatus(true) }}>
                            <div className='justify-around flex'>
                              <div style={{ width: 114 }}>
                                <img style={{ borderRadius: "50%" }} src={"data:image/png;base64," + iterationNews.owner.image.substring(2, iterationNews.owner.image.length - 1)} />
                              </div>
                            </div>
                            <div className='justify-around items-center flex'><h2 style={{ fontFamily: 'League Spartan' }} className='mt-4 text-xl text-[#ffffff]'>{iterationNews.owner.minecraft_username}</h2></div>
                            <div className=' mt-4 text-xl items-center justify-around flex' style={{ borderRadius: 5, backgroundColor: iterationNews.owner.role.color }}><h2 style={{ fontSize: 14, fontWeight: 600, fontFamily: 'League Spartan' }} className='text-[#ffffff]'>{iterationNews.owner.role.role_label}</h2></div>
                          </div>
                          <div className='p-10'>
                            <h4 className='text-[#ffffff]' style={{ fontSize: 16, fontFamily: 'League Spartan' }}>{iterationNews.body}</h4>
                          </div>
                        </div>
                        {
                          isLoggedIn ? (
                            jwt(window.localStorage.getItem("token")).sub.admin &&
                            <div className='justify-around flex mt-5'>
                              <div style={{ fontSize: 24, cursor: 'pointer' }} onClick={() => removeNews(iterationNews.news_id)} className='text-[#e07a65]'><IonIcon name='trash' /></div>
                            </div>
                          ) : (
                            <></>
                          )
                        }
                      </div>
                      <div style={{ width: 740 }}></div>
                    </div>
                  ))
                }
              </div>
              <div className='justify-around flex'>
                <div>
                  <div style={{ minHeight: 154, borderRadius: 10, width: 284 }} className='mt-14 h-auto bg-[#2a313b]'>
                    <div className='p-5 items-center justify-around flex'>
                      <h2 style={{ fontFamily: 'League Spartan' }} className='font-bold text-[#ffffff]'>Staff</h2>
                    </div>
                    <div>
                      {
                        staffers.map(staffer => (
                          <div key={staffer.user_id} onClick={(e) => { setProfile(staffer); setProfileModalStatus(true) }} style={{ cursor: 'pointer', borderTopColor: '#384554', borderTopWidth: 1, height: 74 }} className='items-center flex'>
                            <div className='ml-4' style={{ width: 38 }}>
                              <img style={{ borderRadius: "50%" }} src={"data:image/png;base64," + staffer.image.substring(2, staffer.image.length - 1)} />
                            </div>
                            <div className='ml-4'>
                              <h2 style={{ fontFamily: 'League Spartan' }} className='text-sm text-[#ffffff]'>@{staffer.minecraft_username}</h2>
                              <div className='pr-1 pl-1 text-sm items-center justify-around flex' style={{ borderRadius: 5, backgroundColor: staffer.role.color }}><h2 style={{ fontSize: 10, fontWeight: 600, fontFamily: 'League Spartan' }} className='text-[#ffffff]'>{staffer.role.role_label.toUpperCase()}</h2></div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  <div style={{ minHeight: 154, borderRadius: 10, width: 284 }} className='mt-8 h-auto bg-[#2a313b]'>
                    <div className='p-5 items-center justify-around flex'>
                      <h2 style={{ fontFamily: 'League Spartan' }} className='font-bold text-[#ffffff]'>Utenti più attivi</h2>
                    </div>
                    <div>
                      {
                        recentUsers.map((recentUser) => (
                          <div key={recentUser.user_id} onClick={(e) => { setProfile(recentUser); setProfileModalStatus(true) }} style={{ cursor: 'pointer', borderTopColor: '#384554', borderTopWidth: 1, height: 74 }} className='justify-between items-center flex'>
                            <div className='flex'>
                              <div className='ml-4' style={{ width: 38 }}>
                                <img style={{ borderRadius: "50%" }} src={"data:image/png;base64," + recentUser.image.substring(2, recentUser.image.length - 1)} />
                              </div>
                              <div className='ml-4'>
                                <h2 style={{ fontFamily: 'League Spartan' }} className='text-sm text-[#ffffff]'>@{recentUser.minecraft_username}</h2>
                                <h2 style={{ fontFamily: 'League Spartan' }} className='text-sm text-[#596270]'>{recentUser.name}</h2>
                              </div>
                            </div>
                            <div className='pr-4' style={{ textAlign: 'center' }}>
                              <div><span style={{ fontFamily: 'League Spartan', fontSize: 14 }} className='font-bold text-[#596270]'>Messaggi</span></div>
                              <div><span style={{ fontSize: 14, fontFamily: 'League Spartan' }} className='font-bold text-[white]'>{recentUser.messages}</span></div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  <div style={{ minHeight: 194, borderRadius: 10, width: 284 }} className='mt-8 h-auto bg-[#2a313b]'>
                    <div className='p-5 items-center justify-around flex'>
                      <h2 style={{ fontFamily: 'League Spartan' }} className='font-bold text-[#ffffff]'>Attività del forum</h2>
                    </div>
                    <div style={{ borderTopColor: '#384554', borderTopWidth: 1 }}>
                      <div style={{ width: 284 }} className='mt-3 justify-between flex'>
                        <div style={{ height: 34, width: 154 }} className='ml-4 items-center flex'><span style={{ fontFamily: 'League Spartan' }} className='text-[gray] font-bold'>Utenti registrati:</span></div>
                        <div style={{ height: 34, width: 74 }} className='items-center flex'><span style={{ fontFamily: 'League Spartan' }} className='text-[#ffffff] font-bold'>{serverStats.registered_users}</span></div>
                      </div>
                      <div style={{ width: 284 }} className='justify-between flex'>
                        <div style={{ height: 34, width: 154 }} className='ml-4 items-center flex'><span style={{ fontFamily: 'League Spartan' }} className='text-[gray] font-bold'>Discussioni:</span></div>
                        <div style={{ height: 34, width: 74 }} className='items-center flex'><span style={{ fontFamily: 'League Spartan' }} className='text-[#ffffff] font-bold'>{serverStats.questions}</span></div>
                      </div>
                      <div style={{ width: 284 }} className='justify-between flex'>
                        <div style={{ height: 34, width: 154 }} className='ml-4 items-center flex'><span style={{ fontFamily: 'League Spartan' }} className='text-[gray] font-bold'>Messaggi:</span></div>
                        <div style={{ height: 34, width: 74 }} className='items-center flex'><span style={{ fontFamily: 'League Spartan' }} className='text-[#ffffff] font-bold'>{serverStats.messages}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }
    </div>
  )
}