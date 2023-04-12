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
import VoiceRecord_Recovery from './routes/recoveryRoutes/RecoveryVoice';
import VideoRecord_Recovery from './routes/recoveryRoutes/RecoveryVideo';
import QrCodeComponent from './components/QrCodeComponent';
import Inapp_postReg from './routes/reRegistrationRoutes/Inapp_postReg';
import Inapp_reReg from './routes/reRegistrationRoutes/Inapp_reReg';
import Inapp_Recovery from './routes/recoveryRoutes/RecoveryInapp';
import Fido from './routes/FidoRoute';
import Fido_reReg from './routes/reRegistrationRoutes/Fido_reReg';
import Fido_postReg from './routes/reRegistrationRoutes/Fido_postReg';
import Fido_Recovery from './routes/recoveryRoutes/RecoveryFido';

class App extends React.Component {
  render(){
    return(
      <BrowserRouter>
        <Routes>
          <Route path=':id/re-register' element={<REAuthRoute/>}></Route>
          <Route path=':id/pre-auth/voice' element={<VoiceRecord_reReg/>}></Route>
          <Route path=':id/pre-auth/video' element={<VideoRecord_reReg />}></Route>
          <Route path=':id/pre-auth/inapp' element={<Inapp_reReg />}></Route>
          <Route path=':id/pre-auth/fido' element={<Fido_reReg/>}></Route>
          <Route path=':id/post-auth/voice' element={<VoiceRecord_postReg/>}></Route>
          <Route path=':id/post-auth/video' element={<VideoRecord_postReg />}></Route>
          <Route path=':id/post-auth/inapp' element={<Inapp_postReg />}></Route>
          <Route path=':id/post-auth/fido' element={<Fido_postReg/>}></Route>
          <Route path=':id/:state' element={<AuthRoute/>}></Route>
          <Route path=':id/:state/voice' element={<VoiceRecord/>}></Route>
          <Route path=':id/:state/inapp' element={<QrCodeComponent />}></Route>
          <Route path=':id/:state/fido' element={<Fido/>}></Route>
          <Route path=':id/signup/video' element={<VideoRecord />}></Route>
          <Route path=':id/login/video' element={<VideoLoginRoute />}></Route>
          <Route path=':id/recover/voice/:token' element={<VoiceRecord_Recovery/>}></Route>
          <Route path=':id/recover/video/:token' element={<VideoRecord_Recovery />}></Route>
          <Route path=':id/recover/inapp/:token' element={<Inapp_Recovery />}></Route>
          <Route path=':id/recover/fido/:token' element={<Fido_Recovery/>}></Route>
        </Routes>
    </BrowserRouter>
    )
  }
}

export default App