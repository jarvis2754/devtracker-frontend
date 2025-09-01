import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import './App.css'
import Signup from './pages/auth/Signup'
import SideNavbar from './components/SideNavbar'

import Summary from './pages/Summary'

import Activities from './pages/Activities'
import Projects from './pages/Projects'
import Board from './pages/Board'
import ListTasks from './pages/ListTasks'
import ProjectLayout from './pages/ProjectLayout'
import Login from './pages/auth/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Settings from './pages/Settings'


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
        {/*login and signup routes*/}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/*protected routes*/}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Home /></ProtectedRoute>} />

        <Route path="/projects" element={<ProtectedRoute><ProjectLayout /></ProtectedRoute>}>
          <Route index element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="summary" element={<ProtectedRoute><Summary /></ProtectedRoute>} />
          <Route path="listTasks" element={<ProtectedRoute><ListTasks /></ProtectedRoute>} />
          <Route path="board" element={<ProtectedRoute><Board /></ProtectedRoute>} />
          <Route path="activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
        </Route>
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      </Routes>
    </>
  )
}

export default App
