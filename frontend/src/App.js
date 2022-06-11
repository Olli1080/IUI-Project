import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Recommendations from './pages/Recommendations';

function App() {
  return (
    <Router>
      <header className='app-header'>
        Course Recommender
      </header>
      <Routes>
        <Route path='' element={<LandingPage/>}/>
        <Route path='/recommendations' element={<Recommendations/>}/>
      </Routes>
    </Router>
  )
}

export default App;