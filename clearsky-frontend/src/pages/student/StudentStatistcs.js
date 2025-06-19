import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StudentStatisticsPage.module.css';
import StudentNavbar from './StudentNavbar';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

const StudentStatisticsPage = () => {
    const navigate = useNavigate();
    // courses state will initially only have courseCode and examPeriod
    const [courses, setCourses] = useState([]);
    const [selectedStats, setSelectedStats] = useState(null);
    const [selectedCourseInfo, setSelectedCourseInfo] = useState(null); // Used for the subheading
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // IMPORTANT: Replace 'http://localhost:30032' with your actual service URL in Kubernetes
        axios
            .get('http://localhost:30032/api/stats/all-courses')
            .then((res) => setCourses(res.data))
            .catch((err) => {
                console.error(err);
                setError('Failed to load course list');
            });
    }, []);

    const handleGoToCourses = () => {
        navigate('/student/studentpage');
    };

    const handleViewStats = (courseCode, examPeriod) => {
        setLoading(true);
        setSelectedStats(null); // Clear previous stats
        setError(null);

        // IMPORTANT: Replace 'http://localhost:30032' with your actual service URL in Kubernetes
        axios
            .get(`http://localhost:30032/api/stats/courses/${courseCode}/${encodeURIComponent(examPeriod)}`)
            .then((res) => {
                const fetchedStats = res.data;
                setSelectedStats(fetchedStats);
                setSelectedCourseInfo({ courseCode, examPeriod });
                setLoading(false);

                // --- NEW LOGIC: Update the specific course in the 'courses' state ---
                setCourses(prevCourses =>
                    prevCourses.map(course =>
                        course.courseCode === courseCode && course.examPeriod === examPeriod
                            ? {
                                ...course,
                                createdAt: fetchedStats.createdAt, // Add createdAt from fetched stats
                                updatedAt: fetchedStats.updatedAt   // Add updatedAt from fetched stats
                            }
                            : course
                    )
                );
                // --- END NEW LOGIC ---
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to load course statistics');
                setLoading(false);
            });
    };

    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            // Options for formatting date and time
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false // Use 24-hour format
            };
            return date.toLocaleDateString(undefined, options); // 'undefined' uses default locale
        } catch (e) {
            console.error("Error formatting date:", dateString, e);
            return 'Invalid Date';
        }
    };

    const getGradeDistributionData = () => {
        if (!selectedStats?.gradeDistribution) return [];
        const distributionMap = new Map(Object.entries(selectedStats.gradeDistribution));
        const fullDistribution = [];
        for (let i = 0; i <= 10; i++) {
            fullDistribution.push({
                grade: String(i),
                count: distributionMap.get(String(i)) || 0
            });
        }
        return fullDistribution;
    };

    const getPassFailPieData = () => {
        const passed = selectedStats.passCount ?? 0;
        const failed = selectedStats.notPassCount ?? 0;
        const total = passed + failed;

        const COLORS = ['#82ca9d', '#ff6961'];

        return [
            {
                name: 'Passed',
                value: passed,
                percentage: total ? ((passed / total) * 100).toFixed(1) : 0,
                color: COLORS[0]
            },
            {
                name: 'Failed',
                value: failed,
                percentage: total ? ((failed / total) * 100).toFixed(1) : 0,
                color: COLORS[1]
            }
        ];
    };

    return (
        <>
            <StudentNavbar />
            <div className={styles.container}>
                <div className={styles.headerRow}>
                    <h2 className={styles.heading}>Available Course Statistics</h2>
                    <button className={styles.button} onClick={handleGoToCourses}>
                        Go to My Courses
                    </button>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Exam Period</th>
                        <th>Initial Grades Upload</th> {/* New Column */}
                        <th>Final Grades Last Updated</th> {/* New Column */}
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map((course, index) => ( // Use 'course' object directly
                        <tr key={index}>
                            <td>{course.courseCode}</td>
                            <td>{course.examPeriod}</td>
                            {/* Conditionally display dates only if they exist on the course object */}
                            <td>{course.createdAt ? formatDate(course.createdAt) : 'N/A'}</td>
                            <td>{course.updatedAt ? formatDate(course.updatedAt) : 'N/A'}</td>
                            <td>
                                <button
                                    className={styles.button}
                                    onClick={() => handleViewStats(course.courseCode, course.examPeriod)}
                                >
                                    View Stats
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {loading && <p>Loading statistics...</p>}

                {selectedStats && selectedCourseInfo && (
                    <>
                        <h3 className={styles.subheading}>
                            Stats for {selectedCourseInfo.courseCode} – {selectedCourseInfo.examPeriod}
                        </h3>

                        {/* Combined: Grade Distribution and Pie Chart */}
                        <div className={styles.chartGrid}>
                            <div className={styles.chartBox} style={{ height: '300px' }}>
                                <h4>📊 Grade Distribution (0-10)</h4>
                                <ResponsiveContainer width="100%" height="90%">
                                    <BarChart data={getGradeDistributionData()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="grade" type="category" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className={styles.chartBox} style={{ height: '300px' }}>
                                <h4>✅ Pass vs ❌ Fail (Avg ≥ 5)</h4>
                                <ResponsiveContainer width="100%" height="90%">
                                    <PieChart>
                                        <Pie
                                            data={getPassFailPieData()}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={90}
                                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                                        >
                                            {getPassFailPieData().map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Question-Level Charts */}
                        {selectedStats.questionDistributions && selectedStats.questionAverages && (
                            <>
                                <h3 className={styles.subheading}>📊 Question Performance (0-10)</h3>
                                <div className={styles.chartGrid}>
                                    {Object.entries(selectedStats.questionDistributions).map(([question, dist]) => {
                                        const questionDataMap = new Map(Object.entries(dist));
                                        const data = Array.from({ length: 11 }, (_, i) => ({
                                            score: String(i),
                                            count: questionDataMap.get(String(i)) || 0
                                        }));

                                        const average = selectedStats.questionAverages[question];

                                        return (
                                            <div key={question} className={styles.chartBox} style={{ height: '250px' }}>
                                                <h4>{question} Score Distribution</h4>
                                                <ResponsiveContainer width="100%" height="calc(100% - 30px)">
                                                    <BarChart data={data}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="score" type="category" />
                                                        <YAxis allowDecimals={false} />
                                                        <Tooltip />
                                                        <Bar dataKey="count" fill="#82ca9d" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                                <div style={{ textAlign: 'center', marginTop: '5px', fontWeight: 'bold' }}>
                                                    Average: {average.toFixed(2)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default StudentStatisticsPage;