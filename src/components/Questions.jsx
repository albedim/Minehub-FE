import axios from "axios";
import Avatar from "boring-avatars";
import { useEffect, useState } from "react";
import { IonIcon } from "react-ion-icon";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, fixDate } from "../utils";
import jwt from 'jwt-decode'
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import { Textarea } from "@mui/joy";
import { Loading } from "./Loading";
import { COLORS } from "../config";

export const Questions = () => {

  const [questions, setQuestions] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  const categoryId = useParams().category_id

  const [modalStatus, setModalStatus] = useState(false)

  const [question, setQuestion] = useState({
    'name': '',
    'body': ''
  })

  const [category, setCategory] = useState({})

  const getQuestions = async () => {
    await axios.get(BASE_URL + '/question/get/' + categoryId + "/category", { headers: {"Authorization" : 'Bearer ' + window.localStorage.getItem("token")}})
      .then(response => { setCategory(response.data.category); setQuestions(response.data.questions); setTimeout(() => { setIsLoading(false) }, 1000); })
      .catch(error => {})
  }

  useEffect(() => {
    getQuestions()
  }, [])

  const navigate = useNavigate()

  const addQuestion = async () => {
    await axios.post(BASE_URL + '/question/add', {
      'owner_id': jwt(window.localStorage.getItem("token")).sub.user_id,
      'name': question.name,
      'category_id': categoryId
    })
    .then(response => {
      addMessage(response.data.param)
    })
    .catch(error => {})
  }

  const addMessage = async (questionId) => {
    await axios.post(BASE_URL + '/message/add', {
      'owner_id': jwt(window.localStorage.getItem("token")).sub.user_id,
      'question_id': questionId,
      'body': question.body
    })
    .then(response => getQuestions())
    .catch(error => {})
  }

  const handleQuestion = (e) => {
    const newQuestion = { ...question }
    newQuestion[e.target.name] = e.target.value
    setQuestion(newQuestion)
  }

  useEffect(() => {
    getIsLoggedIn()
  },[])

  const getIsLoggedIn = () => {
    const token = window.localStorage.getItem("token")
    if(token == null){
      navigate("/signin")
    }else{
      axios.get(BASE_URL + '/user/sync', { headers: {"Authorization" : 'Bearer ' + window.localStorage.getItem("token")}})
      .then(response => {
        return
      })
      .catch(error => {
        window.localStorage.setItem("token", error.response.data.error.token)
        window.localStorage.setItem("profile_image", error.response.data.error.image)
      })
    }
  }

  const removeQuestion = async (questionId) => {
    await axios.delete(BASE_URL + '/question/remove/' + questionId, { headers: {"Authorization" : 'Bearer ' + window.localStorage.getItem("token")}})
    .then(response => getQuestions())
    .catch(error => console.log(error))
  }

  
  const removeCategory = async (categoryId) => {
    await axios.delete(BASE_URL + '/category/remove/' + categoryId, { headers: {"Authorization" : 'Bearer ' + window.localStorage.getItem("token")}})
    .then(response => navigate("/forum"))
    .catch(error => {})
  }

  return (
    <div className="justify-around flex w-screen bg-[#242a33]">
      {
        isLoading ? (
          <Loading />
        ) : (
          <>
            <Modal
              open={modalStatus}
              onClose={() => setModalStatus(false)}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box sx={{ justifyContent: 'space-around', display: 'flex', borderRadius: 2, backgroundColor: '#242a33', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, boxShadow: 24, pt: 2, px: 4, pb: 3, width: 400 }}>
                <div>
                  <div className='mt-4'>
                    <h2 style={{ fontFamily: 'League Spartan' }} className='text-[#ffffff]'>Nome della discussione</h2>
                    <input onChange={(e) => handleQuestion(e)} name='name' style={{ borderRadius: 10, height: 34, color: 'white', border: 'none', outline: 'none', backgroundColor: '#2a313b' }} className='bg-[gray]' type="text" />
                  </div>
                  <div className='mt-4'>
                    <h2 style={{ fontFamily: 'League Spartan' }} className='text-[#ffffff]'>Messaggio</h2>
                    <Textarea
                      disabled={false}
                      value={question.body}
                      minRows={2}
                      name="body"
                      onChange={(e) => handleQuestion(e)}
                      maxRows={4}
                      style={{ color: 'white', border: 'none', outline: 'none', backgroundColor: '#2a313b' }}
                    />
                    <div className='mt-14 justify-around flex'>
                      {
                        question.name == "" || question.body == "" ? (
                          <button style={{ backgroundColor: COLORS[0], color: 'white', fontFamily: 'League Spartan', borderRadius: 5 }} className='opacity-40 mt-4 p-3'>Crea discussione</button>
                        ) : (
                          <button onClick={(e) => {addQuestion(); getQuestions(); setModalStatus(false)}} style={{ backgroundColor: COLORS[0], color: 'white', fontFamily: 'League Spartan', borderRadius: 5 }} className='mt-4 p-3'>Crea discussione</button>
                        )
                      }
                    </div>
                  </div>
                </div>
              </Box>
            </Modal>
            <div className='w-screen justify-around bodyhome flex'>
              <div>
                <div style={{maxWidth: 1040 }} className='pl-8 mt-14 pr-14'>
                  <div style={{ borderRadius: 10, fontFamily: 'League Spartan', height: 64 }} className='justify-between pl-10 pr-10 font-bold flex items-center text-[#ffffff] bg-[#2a313b]'>
                    <div className="flex">
                      <IonIcon style={{ color: COLORS[0], fontSize: 24 }} name="chatbubbles" />
                      <h2 className='ml-4 text-xl'>Discussioni</h2>
                    </div>
                    <div className="flex">
                    {
                      category.editable ? (       
                          <div className="items-center justify-around flex pl-8 pr-8" onClick={(e) => setModalStatus(true)} style={{cursor: 'pointer', color: COLORS[0], fontSize: 24 }}><IonIcon name='add-circle' /></div>
                      ):(
                        jwt(window.localStorage.getItem("token")).sub.admin &&
                          <div className="items-center justify-around flex pl-8 pr-8" onClick={(e) => setModalStatus(true)} style={{cursor: 'pointer', color: COLORS[0], fontSize: 24 }}><IonIcon name='add-circle' /></div>
                      )
                    }
                    {
                      jwt(window.localStorage.getItem("token")).sub.admin &&
                        <div className="text-[#e07a65] justify-around items-center flex" style={{ fontSize: 21, cursor: 'pointer' }} onClick={(e) => removeCategory(category.category_id)}><IonIcon name='trash' /></div>
                    }
                    </div>
                  </div>
                  <div style={{overflowY: 'scroll', maxHeight: 750}} className='mt-4 p-10 bg-[#2a313b]'>
                    {
                      questions.map(question => (
                        <div key={question.question_id} style={{ borderBottomWidth: 1, borderBottomColor: '#384554', height: 94 }} className="justify-between items-center flex">
                          <div onClick={(e) => navigate("/question/" + question.question_id)}  style={{cursor: 'pointer',}} className="pr-4 pl-4 flex">
                            <div className='items-center justify-around flex'>
                              <div style={{ width: 34 }}>
                                <img style={{borderRadius: "50%"}} src={"data:image/png;base64," + question.owner.image.substring(2,question.owner.image.length - 1)}/>
                              </div>
                            </div>
                            <div>
                              <div className="flex">
                                <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: 'League Spartan' }} className='none-block text-xl ml-4 text-[#ffffff]'>{question.name.length > 8 ? question.name.substring(0,8) + "..." : question.name}</h2>
                                <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: 'League Spartan' }} className='block-none text-xl ml-4 text-[#ffffff]'>{question.name}</h2>
                                <div style={{ width: 78 }} className="items-center ml-2 text-2xl justify-around flex">
                                  {
                                    question.status == 'just_created' &&
                                    <div style={{ height: 21.4, fontFamily: 'League Spartan', borderRadius: 5 }} className="font-bold items-center flex pr-2 pl-2 bg-[#eb9a5b] text-[#ffffff]" ><h2 style={{ fontSize: 9 }}>DA VALUTARE</h2></div>
                                  }
                                  {
                                    question.status == 'reading' &&
                                    <div style={{ height: 21.4, fontFamily: 'League Spartan', borderRadius: 5 }} className="font-bold items-center flex pr-2 pl-2 bg-[#d97b2e] text-[#ffffff]" ><h2 style={{ fontSize: 9 }}>VALUTANDO</h2></div>
                                  }
                                  {
                                    question.status == 'accepted' &&
                                    <div style={{ height: 21.4, fontFamily: 'League Spartan', borderRadius: 5 }} className="font-bold items-center flex pr-2 pl-2 bg-[#8fc46c] text-[#ffffff]" ><h2 style={{ fontSize: 9 }}>ACCETTATA</h2></div>
                                  }
                                  {
                                    question.status == 'rejected' &&
                                    <div style={{ height: 21.4, fontFamily: 'League Spartan', borderRadius: 5 }} className="font-bold items-center flex pr-2 pl-2 bg-[#d96a5d] text-[#ffffff]" ><h2 style={{ fontSize: 9 }}>RIFIUTATA</h2></div>
                                  }
                                </div>
                              </div>
                              <div className="none-flex ml-2">
                                <div className="flex pl-2 pr-2">
                                  <h2 style={{fontSize: 14, fontFamily: 'League Spartan' }} className="font-bold text-[#596270]">Messaggi:</h2>
                                  <h2 className="font-bold" style={{fontSize: 14, fontFamily: 'League Spartan', color: '#596270' }}>{question.messages}</h2>
                                </div>
                              </div>
                              <h2 style={{ fontSize: 14, fontWeight: 600, fontFamily: 'League Spartan' }} className='text-xl ml-4 text-[#596270]'>{question.owner.minecraft_username} - {fixDate(question.created_on)}</h2>
                            </div>
                          </div>
                          <div className="block-none ml-8 flex">
                            <div className="pl-2 pr-2" style={{ textAlign: 'center' }}>
                              <h2 style={{ fontFamily: 'League Spartan' }} className="font-bold text-[#ffffff]">Messaggi</h2>
                              <h2 className="font-bold" style={{ fontFamily: 'League Spartan', color: '#596270' }}>{question.messages}</h2>
                            </div>
                          </div>
                          {
                            jwt(window.localStorage.getItem("token")).sub.admin || jwt(window.localStorage.getItem("token")).sub.user_id == question.owner_id ? (
                              <div style={{width: 80}} className='justify-around flex'>
                                <div style={{ fontSize: 21, cursor: 'pointer' }} onClick={(e) => removeQuestion(question.question_id)} className='text-[#e07a65]'><IonIcon name='trash' /></div>
                              </div>
                            ):(
                              <></>
                            )  
                          }
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
}