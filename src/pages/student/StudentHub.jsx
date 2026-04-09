import { Routes, Route } from 'react-router-dom'
import ClassSelection from './ClassSelection'
import SubjectSelection from './SubjectSelection'
import MathHub from './MathHub'
import LessonPage from './LessonPage'

export default function StudentHub() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="subjects" element={<SubjectSelection />} />
        <Route path="math-hub" element={<MathHub />} />
        <Route path="lesson/:subId" element={<LessonPage />} />
        <Route path="*" element={<ClassSelection />} />
      </Routes>
    </div>
  )
}
