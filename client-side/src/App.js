// import logo from './logo.svg';
import React , {useEffect, useState} from 'react';
import axois from 'axios';

import './App.css';

function App(){
  const [message, setMessage] = useState('');
  useEffect(()=>{
    axois.get('/').then(responce => {
      if(responce.data && responce.data.message){
        setMessage(responce.data.message);
      }else{
        console.log("Unexpected responce str: ",responce.data);
      }
    }).catch(error => {
      console.error('There is an error to fatching data ',error);
    });
  },[]);
  return (
    <>
      <div className='App'>
        <h1>{message || 'Welcome Home'}</h1>
      </div>
    </>
  );
}

export default App;
