import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ProjectPlan from './pages/ProjectPlan'
import MeetingNotes from './pages/MeetingNotes'
import BugReport from './pages/BugReport'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="project-plan/:fileId" element={<ProjectPlan />} />
          <Route path="meeting-notes/:fileId" element={<MeetingNotes />} />
          <Route path="bug-report/:fileId" element={<BugReport />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
