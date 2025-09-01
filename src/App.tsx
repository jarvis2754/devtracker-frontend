import {  Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import './App.css'
import Signup from './pages/auth/Signup'
import SideNavbar from './components/SideNavbar'
import Login from './pages/auth/Login'

function App() {
  const location = useLocation();
  const hideNav = () => {
    return location.pathname === "/login" || location.pathname === "/signup";
  }
  return (
    <>
      {!hideNav() && <Navbar />}
      {!hideNav() && <SideNavbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/messages" element={<Home />} />
        <Route path="/tasks" element={<Home />} />
        <Route path="/members" element={<Home />} />
        <Route path="/settings" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
