import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { decodeToken, isTokenExpired } from './auth/token';
import { tryToRefreshToken } from './auth/refresh';

import Navbar from './components/NavBar';
import StudentStatisticsPage from './pages/student/StudentStatistcs';
import InstructorPage from './pages/instructor/InstructorPage';
import StudentPage from "./pages/student/StudentPage";
import GradeDetails from './components/GradeDetails';
import UploadGrades from './pages/instructor/UploadGrades';
import InstructorLayout from './pages/instructor/InstructorLayout';
import InstructorStatisticsPage from "./pages/instructor/InstructorStatistics";
import LoginPage from './pages/LoginPage';
import RepresentativePage from './pages/representative/RepresentativePage';
import UploadFinalGrades from './pages/instructor/UploadFinalGrades';
import RepresentativeStatisticsPage from './pages/representative/RepresentativeStatistics'; // add this at the top
// Protected Route wrapper
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    const [authToken, setAuthToken] = useState(localStorage.getItem('accessToken'));
    console.log(authToken)
    const [userRole, setUserRole] = useState(() => {
        const decoded = decodeToken(localStorage.getItem('accessToken'));
        return decoded?.role || null;
    });

    useEffect(() => {
        (async () => {
            if (!authToken) return;

            const decoded = decodeToken(authToken);
            if (!decoded) return handleLogout();

            if (isTokenExpired(authToken)) {
                const newDecoded = await tryToRefreshToken();
                if (!newDecoded) return handleLogout();

                setAuthToken(localStorage.getItem('accessToken'));
                setUserRole(newDecoded.role);
            } else {
                setUserRole(decoded.role);
            }
        })();
    }, [authToken]);

    const handleLogin = (accessToken, refreshToken) => {
        console.log("App.js: handleLogin called.");
        console.log("App.js: Received accessToken:", accessToken);
        console.log("App.js: Received refreshToken:", refreshToken);

        // Check if tokens are actually valid before attempting to store
        if (!accessToken || typeof accessToken !== 'string' || accessToken.length === 0) {
            console.error("App.js: accessToken is invalid or empty. Cannot store.");
            handleLogout(); // Or display an error message to the user
            return;
        }
        if (!refreshToken || typeof refreshToken !== 'string' || refreshToken.length === 0) {
            console.error("App.js: refreshToken is invalid or empty. Cannot store.");
            // Decide if you want to logout or proceed without refresh token
            // For now, let's just log and continue if accessToken is there
        }

        try {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            console.log("App.js: Tokens attempted to be stored in localStorage.");

            // Immediately check if they are there *after* attempting to store
            console.log("App.js: localStorage.getItem('accessToken') after set:", localStorage.getItem('accessToken'));
            console.log("App.js: localStorage.getItem('refreshToken') after set:", localStorage.getItem('refreshToken'));

        } catch (e) {
            console.error("App.js: Error storing tokens in localStorage:", e);
            // This could happen if localStorage is full or disabled
            alert("Could not store login information. Please check browser settings or clear site data.");
            handleLogout();
            return;
        }

        setAuthToken(accessToken); // Update state with the token

        const decoded = decodeToken(accessToken);
        let roleToRedirect = null;

        if (decoded?.role) {
            roleToRedirect = decoded.role;
            setUserRole(roleToRedirect); // Update state with the role
        } else {
            console.error("App.js: Decoded token has no role or is invalid.");
            handleLogout();
            return;
        }

        console.log("App.js: Login successful! User role:", roleToRedirect);
        console.log("App.js: Attempting to navigate to:", getRedirectPathForRole(roleToRedirect));
    };

    const handleLogout = () => {
        setAuthToken(null);
        setUserRole(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    // REMOVE THIS FOR REAL LOGIN
    // if (!localStorage.getItem('accessToken')) {
    //     const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    //         'eyJzdWIiOiJkZXYtdXNlciIsInJvbGUiOiJpbnN0cnVjdG9yIn0.' +
    //         'devsignature';
    //     localStorage.setItem('accessToken', fakeToken);
    //     localStorage.setItem('refreshToken', 'fake-refresh-token');
    // }

    const getRedirectPathForRole = (roleToRedirect) => {
        switch (roleToRedirect) {
            case 'student':
                return '/student/statistics';
            case 'instructor':
                return '/instructor/upload';
            case 'institution_representative':
                return '/representative';
            case 'admin':
                return '/representative';
            default:
                return '/login';
        }
    };

    return (
        <Router>
            <Navbar isLoggedIn={!!authToken} onLogout={handleLogout} />
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={!authToken ? <LoginPage onLogin={handleLogin} /> : <Navigate to={getRedirectPathForRole(userRole)} />} />
                <Route path="/" element={<Navigate to={authToken ? getRedirectPathForRole() : '/login'} />} />

                {/* Student Routes */}
                <Route path="/student/statistics" element={<PrivateRoute><StudentStatisticsPage /></PrivateRoute>} />
                <Route path="/student/studentpage" element={<PrivateRoute><StudentPage /></PrivateRoute>} />
                <Route path="/student/grades/:courseId" element={<PrivateRoute><GradeDetails /></PrivateRoute>} />
                <Route path="/student/grades" element={<PrivateRoute><StudentPage /></PrivateRoute>} />
                <Route path="/student/review-request" element={<PrivateRoute><StudentPage /></PrivateRoute>} />
                <Route path="/student/review-status" element={<PrivateRoute><StudentPage /></PrivateRoute>} />

                {/* Instructor Routes */}
                <Route path="/instructor" element={<PrivateRoute><InstructorLayout /></PrivateRoute>}>
                    <Route index element={<UploadGrades />} />
                    <Route path="upload" element={<UploadGrades />} />
                    <Route path="reviews" element={<InstructorPage />} />
                    <Route path="statistics" element={<InstructorStatisticsPage />} />
                    <Route path="upload-final" element={<UploadFinalGrades />} />
                </Route>

                {/* Representative Routes */}
                <Route path="/representative" element={<PrivateRoute><RepresentativePage /></PrivateRoute>} />
                <Route path="/representative/statistics" element={<PrivateRoute><RepresentativeStatisticsPage /></PrivateRoute>} />

            </Routes>
        </Router>
    );
}

export default App;