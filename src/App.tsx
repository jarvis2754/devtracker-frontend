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

        <Route path="/projects" element={<ProjectLayout />}>
          <Route index element={<Projects />} />
          <Route path="summary" element={<Summary />} />
          <Route path="listTasks" element={<ListTasks />} />
          <Route path="board" element={<Board />} />
          <Route path="activities" element={<Activities />} />
        </Route>
        <Route path="/settings" element={<Home />} />
        <Route path="/login" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
