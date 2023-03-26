import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AuthRoute from './routes/AuthRoute';
import VideoRecord from './routes/VideoRecord';
import VoiceRecord from './routes/VoiceRecord';
import REAuthRoute from './routes/reRegistrationRoutes/REAuthRoute';
import VoiceRecord_reReg from './routes/reRegistrationRoutes/VoiceRecord_reReg';
import VideoRecord_reReg from './routes/reRegistrationRoutes/VideoRecord_reReg';
import VoiceRecord_postReg from './routes/reRegistrationRoutes/VoiceRecord_postReg';
import VideoRecord_postReg from './routes/reRegistrationRoutes/VideoRecord_postReg';
import VideoLoginRoute from './routes/VideoLoginRoute';
import VideoRecorder from './components/Websocket';

class App extends React.Component {
  render(){
    return(
      <BrowserRouter>
        <Routes>
          <Route path=':id/re-register' element={<REAuthRoute/>}></Route>
          <Route path=':id/pre-auth/voice' element={<VoiceRecord_reReg/>}></Route>
          <Route path=':id/pre-auth/video' element={<VideoRecord_reReg />}></Route>
          <Route path=':id/post-auth/voice' element={<VoiceRecord_postReg/>}></Route>
          <Route path=':id/post-auth/video' element={<VideoRecord_postReg />}></Route>
          <Route path=':id/:state' element={<AuthRoute/>}></Route>
          <Route path=':id/:state/voice' element={<VoiceRecord/>}></Route>
          <Route path=':id/:state/video' element={<VideoRecord />}></Route>
          <Route path=':id/login/video' element={<VideoLoginRoute />}></Route>
          <Route path=':id/login/websocket' element={<VideoRecorder />}></Route>
        </Routes>
    </BrowserRouter>
    )
  }
}

export default App