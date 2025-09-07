import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/home/Home'
import './App.css'
import Signup from './pages/auth/Signup'
import SideNavbar from './components/SideNavbar'
import Login from './pages/auth/Login'
import Summary from './pages/projects/Summary'
import Activities from './pages/projects/Activities'

import Board from './pages/projects/Board'
import ListTasks from './pages/projects/ListTasks'
import ProjectLayout from './components/ProjectLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Settings from './pages/Settings'
import NoContent from './components/NoContent'
import OrganizationPage from './pages/auth/OrganizationPage'
import ChatPanel from './components/ChatPanel'


function App() {
  
  const location = useLocation();

  const hideNav = () => {
    return location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "join-organization";
  }
  return (
    <>
      {!hideNav() && <Navbar />}
      {!hideNav() && <SideNavbar />}
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/join-organization" element={<OrganizationPage />} />

        {/*protected routes*/}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><ChatPanel/></ProtectedRoute>} />

        <Route path="/projects" element={<ProtectedRoute><ProjectLayout /></ProtectedRoute>}>
          <Route path=":id" element={<ProtectedRoute><Summary /></ProtectedRoute>} />
          <Route path=":id/listTasks" element={<ProtectedRoute><ListTasks /></ProtectedRoute>} />
          <Route path=":id/no-content" element={<ProtectedRoute><NoContent /></ProtectedRoute>} />
          <Route path=":id/board" element={<ProtectedRoute><Board /></ProtectedRoute>} />
          <Route path=":id/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
        </Route>

        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      </Routes>
    </>
  )
}

export default App
