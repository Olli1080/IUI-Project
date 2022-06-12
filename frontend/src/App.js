import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Recommendations from './pages/Recommendations'
import CourseSelector from './pages/CourseSelector'

function App() {
  return (
    <Router>
      <header className='app-header'>
        Course Recommender
      </header>
      <Routes>
        <Route path='' element={<LandingPage/>}/>
        <Route path='/recommendations' element={<Recommendations/>}/>
        <Route path='/course-selector' element={<CourseSelector/>}/>
      </Routes>
    </Router>
  )
}

export default App;