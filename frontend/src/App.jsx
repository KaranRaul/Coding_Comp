import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import CreateUser from './components/createUser'
import HomePage from './components/HomePage'
import CreateRoom from './components/CreateRoom'
import Main from './components/Main';
// import CodeEditor from './components/TestMain';

function App() {

  return (
    <>

      <Router>

        <Routes>
          <Route path='/' element={<CreateUser />} />
          <Route path='/homepage' element={<HomePage />} />
          <Route path='/createroom' element={<CreateRoom />} />
          <Route path='/main' element={< Main />} />
          {/* <Route path='/test' element={<CodeEditor />} /> */}
        </Routes>

      </Router>
    </>
  )
}

export default App
