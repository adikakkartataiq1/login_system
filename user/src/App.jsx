import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login"



function App() {

  
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Login />} />
        
        
      </Routes>
    </Router>
  )
}

export default App
