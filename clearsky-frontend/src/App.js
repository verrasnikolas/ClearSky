import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import StudentPage from './pages/StudentPage';
import InstructorPage from './pages/InstructorPage';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/student" element={<StudentPage />} />
                <Route path="/instructor" element={<InstructorPage />} />
            </Routes>
        </Router>
    );
}

export default App;
