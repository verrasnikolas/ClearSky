import React from 'react';
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

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<LoginPage />} />

                {/* Student routes */}
                <Route path="/student" element={<Navigate to="/student/statistics" />} />
                {/*<Route path="/student/login" element={<StudentLogin />} />*/}
                <Route path="/student/statistics" element={<StudentStatisticsPage />} />
                <Route path="/student/studentpage" element={<StudentPage />} />
                <Route path="/student/grades/:courseId" element={<GradeDetails />} />
                <Route path="/student/grades" element={<StudentPage />} />
                <Route path="/student/review-request" element={<StudentPage />} />
                <Route path="/student/review-status" element={<StudentPage />} />


                {/* Instructor route */}


                <Route path="/instructor" element={<InstructorLayout />}>
                    <Route index element={<UploadGrades />} />
                    <Route path="upload" element={<UploadGrades />} />
                    <Route path="reviews" element={<InstructorPage />} />
                    <Route path="statistics" element={<InstructorStatisticsPage />} />

                </Route>


            </Routes>
        </Router>
    );
}

export default App;
