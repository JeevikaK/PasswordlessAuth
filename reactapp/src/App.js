import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AuthRoute from './routes/AuthRoute';
import VideoRecord from './routes/VideoRecord';
import VoiceRecord from './routes/VoiceRecord';

class App extends React.Component {
  render(){
    return(
      <BrowserRouter>
        <Routes>
          {/* <Route path=':id/login' element={<AuthRoute authState={'login'}/>}></Route>
          <Route path=':id/signup' element={<AuthRoute authState={'signup'}/>}></Route> */}
          <Route path=':id/:state' element={<AuthRoute/>}></Route>
          <Route path=':id/:state/voice' element={<VoiceRecord/>}></Route>
          <Route path=':id/:state/video' element={<VideoRecord />}></Route>
        </Routes>
    </BrowserRouter>
    )
  }
}

export default App