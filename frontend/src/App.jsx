import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import CreateUser from './components/CreateUser'
import HomePage from './components/HomePage'
import CreateRoom from './components/CreateRoom'
import Main from './components/Main';
// import CodeEditor from './components/TestMain';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<CreateUser />} />
          <Route exact path='/homepage' element={<HomePage />} />
          <Route exact path='/createroom' element={<CreateRoom />} />
          <Route exact path='/main' element={< Main />} />
          {/* <Route path='/test' element={<CodeEditor />} /> */}
        </Routes>

      </Router>
    </>
  )
}

export default App
