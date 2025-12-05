import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navigation from "@/components/navigation"
import Home from "@/pages/Home"
import Statistics from "@/pages/Statistics"
import "@/styles/globals.css"

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </Router>
  )
}

export default App
