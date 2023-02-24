import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import SignUp from './routes/SignUp';
import VoiceRecord from './routes/VoiceRecord';


class App extends React.Component {
  render(){
    return(
      <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<SignUp ></SignUp>}></Route>
        <Route path='/voice' element={<VoiceRecord></VoiceRecord>}></Route>
      </Routes>
    </BrowserRouter>
    )
  }
}

export default App