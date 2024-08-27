import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComponent from './components/loginComponent';
import Home from './components/home';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
  );
}

export default App;