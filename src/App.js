import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Home from './Home';
import HistoryPage from './HistoryPage';
import './App.css';

function App() {
  return (
    <Router>
    <div className ='App-parent'>
      <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/history" element={<HistoryPage/>}></Route>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
