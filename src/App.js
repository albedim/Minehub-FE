import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import { Hero } from './components/Hero';
import { Menu } from './components/Menu';
import { Header } from './components/Header';
import { Loading } from './components/Loading';
import { Home } from './components/Home';
import { Forum } from './components/Forum';
import { Questions } from './components/Questions';
import { Footer } from './components/Footer';
import { Question } from './components/Question';
import { Admin } from './components/Admin';
import { Signin } from './components/Signin';
import { Signup } from './components/Signup';
import { PasswordRecovery } from './components/PasswordRecovery';
import { CreatePassword } from './components/CreatePassword';
import axios from 'axios';
import { BASE_URL } from './utils';
import { useEffect, useState } from 'react';
import { Maintenance } from './components/Maintenance';
import { NotFound } from './components/NotFound';

function App() {

  const getMaintenance = async () => {
    await axios.get(BASE_URL + "/server/maintenance")
    .then(response => {
      setMaintenance(response.data.param)
    })
    .catch(error => console.log(error))
  }

  const [maintenance, setMaintenance] = useState(false)

  useEffect(() => {
    getMaintenance()
  })

  return (
    <BrowserRouter>
      <Routes>
        {
          maintenance ? (
            <>
              <Route path='/admin' element={<><Admin/></>}/>
              <Route path="/" element={<><Maintenance/></>}/>
            </>
          ):(
            <>
              <Route path='/admin' element={<><Admin/></>}/>
              <Route path='/create_password' element={<><CreatePassword/></>} />
              <Route path='/password_recovery' element={<><PasswordRecovery/></>}/>
              <Route path='/signup' element={<><Signup/></>}/>
              <Route path='/signin' element={<><Signin/></>}/>
              <Route path="/forum" element={<><Hero/><Menu param={"forum"}/><Forum/><Footer/></>}/>
              <Route path='/question/:question_id' element={<><Hero/><Menu param={"forum"}/><Question/><Footer/></>}/>
              <Route path='/forum/:category_id' element={<><Hero/><Menu param={"forum"}/><Questions/><Footer/></>}/>
              <Route path="/" element={<><Hero/><Menu param={"home"}/><Home/><Footer/></>}/>
            </>
          )
        }
        <Route path='/*' element={<><NotFound/></>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
