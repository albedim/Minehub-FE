import * as React from 'react';
import Button from '@mui/joy/Button';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import { IonIcon } from 'react-ion-icon';
import { useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';
import Avatar from 'boring-avatars';
import { BASE_URL } from '../utils';
import axios from 'axios';

export default function BasicMenu({ questionId }) {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [statuses, setStatuses] = React.useState({
    'just_created': 'Da valutare',
    'reading': 'Valutando',
    'accepted': 'Accettata',
    'rejected': 'Rifiutata'
  })

  const open = Boolean(anchorEl);

  const [question, setQuestion] = React.useState({})


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getQuestion = async () => {
    await axios.get(BASE_URL + "/question/get/" + questionId, { headers: {"Authorization" : 'Bearer ' + window.localStorage.getItem("token")}})
      .then(response => {
        setQuestion(response.data)
      })
      .catch(error => {})
  }

  React.useEffect(() => {
    getQuestion()
  },[])

  const changeStatus = async (status) => {
    await axios.put(BASE_URL + "/question/change/status", {
      'question_id': questionId,
      'status': status
    }, { headers: {"Authorization" : 'Bearer ' + window.localStorage.getItem("token")}})
    .then(response => {
      getQuestion()
    })
    .catch(error => {})
  }

  const statusColor = (status) => {
    switch (status) {
      case 'just_created':
        return '#eb9a5b'
        break;
      case 'reading':
        return '#d97b2e'
        break;
      case 'accepted':
        return '#8fc46c'
        break;
      case 'rejected':
        return '#d96a5d'
        break;
      default:
        return 'gray'
        break;
    }
  }

  return (
    <div className='align-center space-around display-flex border-radius-5'>
      {
        jwt(window.localStorage.getItem('token')).sub.admin ? (
          <Button
            id="basic-demo-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            color=""
            onClick={handleClick}
          ><div style={{backgroundColor: statusColor(question.status), borderRadius: 5}} className='p-2'><h2 style={{fontFamily: 'League Spartan', fontSize: 14}}>{statuses[question.status]}</h2></div></Button>
        ):(
          <Button
            id="basic-demo-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            color=""
            onClick={{}}
          ><div style={{borderRadius: 5}} className='bg-[gray] p-2'><h2 style={{fontFamily: 'League Spartan', fontSize: 14}}>{statuses[question.status]}</h2></div></Button>
        )
      }
      <Menu
        id="basic-menu"
        style={{ width: 114, border: 'none', boxShadow: '-2px -2px 12px -5px rgba(110,110,110,0.14)', borderRadius: 5, backgroundColor: 'white' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        aria-labelledby="basic-demo-button"
      >
        <MenuItem
          style={{backgroundColor: 'gray', fontSize: 14, fontWeight: 400, fontFamily: 'League Spartan' }}
          onClick={() => {changeStatus('just_created'); handleClose()}}>
          Da valutare
        </MenuItem>
        <MenuItem
          style={{ fontSize: 14, fontWeight: 400, fontFamily: 'League Spartan' }}
          onClick={() => {changeStatus('reading'); handleClose()}}>
          In valutazione
        </MenuItem>
        <MenuItem
          style={{ fontSize: 14, fontWeight: 400, fontFamily: 'League Spartan' }}
          onClick={() => {changeStatus('accepted'); handleClose()}}>
          Accetta e chiudi
        </MenuItem>
        <MenuItem
          style={{ fontSize: 14, fontWeight: 400, fontFamily: 'League Spartan' }}
          onClick={() => {changeStatus('rejected'); handleClose()}}>
          Rifiutata e chiudi
        </MenuItem>
      </Menu>
    </div>
  );
}