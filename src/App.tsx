import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/messages" element={<Home />} />
        <Route path="/tasks" element={<Home />} />
        <Route path="/members" element={<Home />} />
        <Route path="/settings" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
