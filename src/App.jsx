import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import CoursesPage from './pages/CoursesPage.jsx'
import ProgramsPage from './pages/Programs/ProgramsPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
