import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import StudentLogin from './pages/StudentLogin'
import AdminLogin from './pages/AdminLogin'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </div>
  )
}

export default App
