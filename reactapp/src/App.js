import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginRoute from './routes/LoginRoute';
import SignUp from './routes/SignUp';
import VideoRecord from './routes/VideoRecord';
import VoiceRecord from './routes/VoiceRecord';
import RecoveryRoute from './routes/recoveryRoute';

class App extends React.Component {
  render(){
    return(
      <BrowserRouter>
      <Routes>
        {/* <Route path='/signup' element={<SignUp ></SignUp>}></Route> */}
        <Route path=':id/:state' element={<LoginRoute />}></Route>
        <Route path=':id/:state/voice' element={<VoiceRecord></VoiceRecord>}></Route>
        <Route path=':id/:state/video' element={<VideoRecord />}></Route>
        <Route path='/recovery' element={<RecoveryRoute />}></Route>
      </Routes>
    </BrowserRouter>
    )
  }
}

export default App