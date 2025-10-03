import NavBar from './components/NavBar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Sensors from './pages/Sensors'
import History from './pages/History'

function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <NavBar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sensors" element={<Sensors />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
