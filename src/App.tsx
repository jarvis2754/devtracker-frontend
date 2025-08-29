import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import './App.css'
import Signup from './pages/auth/Signup'

function App() {
  const location = useLocation();
  const hideNav = () => {
    return location.pathname === "/login" || location.pathname === "/signup";
  }
  return (
    <>
      {!hideNav() && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/messages" element={<Home />} />
        <Route path="/tasks" element={<Home />} />
        <Route path="/members" element={<Home />} />
        <Route path="/settings" element={<Home />} />
        <Route path="/login" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
