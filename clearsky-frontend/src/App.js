import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import StudentLogin from './pages/LoginPage';
import StudentStatisticsPage from './pages/student/StudentStatistcs';
import InstructorPage from './pages/instructor/InstructorPage';
import StudentPage from "./pages/student/StudentPage";
import GradeDetails from './components/GradeDetails'; // create this next
import UploadGrades from './pages/instructor/UploadGrades';
import InstructorLayout from './pages/instructor/InstructorLayout';
import InstructorStatisticsPage from "./pages/instructor/InstructorStatistics";
import LoginPage from './pages/LoginPage';
import RepresentativePage from './pages/RepresentativePage';

function App() {
    const [authToken, setAuthToken] = useState(localStorage.getItem('accessToken') || null);

    const handleLogin = (token) => {
        setAuthToken(token);
    };

    const handleLogout = () => {
        setAuthToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    return (
        <Router>
            <Navbar isLoggedIn={!!authToken} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={authToken ? <Navigate to="/student/statistics" /> : <LoginPage onLogin={handleLogin} />} />
                <Route path="/login" element={authToken ? <Navigate to="/student/statistics" /> : <LoginPage onLogin={handleLogin} />} />

                {/* Student routes */}
                <Route path="/student" element={authToken ? <Navigate to="/student/statistics" /> : <Navigate to="/login" />} />
                <Route path="/student/statistics" element={authToken ? <StudentStatisticsPage /> : <Navigate to="/login" />} />
                <Route path="/student/studentpage" element={authToken ? <StudentPage /> : <Navigate to="/login" />} />
                <Route path="/student/grades/:courseId" element={authToken ? <GradeDetails /> : <Navigate to="/login" />} />
                <Route path="/student/grades" element={authToken ? <StudentPage /> : <Navigate to="/login" />} />
                <Route path="/student/review-request" element={authToken ? <StudentPage /> : <Navigate to="/login" />} />
                <Route path="/student/review-status" element={authToken ? <StudentPage /> : <Navigate to="/login" />} />


                {/* Instructor route */}
                <Route path="/instructor" element={authToken ? <InstructorLayout /> : <Navigate to="/login" />}>
                    <Route index element={<UploadGrades />} />
                    <Route path="upload" element={<UploadGrades />} />
                    <Route path="reviews" element={<InstructorPage />} />
                    <Route path="statistics" element={<InstructorStatisticsPage />} />
                </Route>

                <Route path="/representative" element={<RepresentativePage />} />


            </Routes>
        </Router>
    );
}

export default App;