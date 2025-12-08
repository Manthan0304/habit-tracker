import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navigation from "@/components/navigation"
import Home from "@/pages/Home"
import Statistics from "@/pages/Statistics"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import "@/styles/globals.css"

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
