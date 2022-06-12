import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Recommendations from './pages/Recommendations';
import Form from './pages/Form'

function App() {
  return (
    <Router>
      <header className='app-header'>
        Course Recommender
      </header>
      <Routes>
        <Route path='' element={<LandingPage/>}/>
        <Route path='/recommendations' element={<Recommendations/>}/>
        <Route path='/form' element={<Form/>}/>
      </Routes>
    </Router>
  )
}

export default App;