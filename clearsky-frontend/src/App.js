import React from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import StudentLogin from './pages/student/StudentLogin';
import StudentStatisticsPage from './pages/student/StudentStatistcs';
import InstructorPage from './pages/InstructorPage';
import StudentPage from "./pages/student/StudentPage";
import GradeDetails from './components/GradeDetails'; // create this next


function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />

                {/* Student routes */}
                <Route path="/student" element={<Navigate to="/student/login" />} />
                <Route path="/student/login" element={<StudentLogin />} />
                <Route path="/student/statistics" element={<StudentStatisticsPage />} />
                <Route path="/student/studentpage" element={<StudentPage />} />
                <Route path="/student/grades/:courseId" element={<GradeDetails />} />

                {/* Instructor route */}
                <Route path="/instructor" element={<InstructorPage />} />
            </Routes>
        </Router>
    );
}

export default App;
