import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import CoursesPage from './pages/CoursesPage.jsx'
import ProgramsPage from './pages/Programs/ProgramsPage.jsx'
import Testimonials from './pages/Testimonials/Testimonials.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/testimonials" element={<Testimonials />} />
      </Routes>
    </BrowserRouter>
  )
}
