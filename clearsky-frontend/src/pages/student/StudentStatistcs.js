// src/pages/StudentStatisticsPage.js
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
    const [courses, setCourses] = useState([]);
    const [selectedStats, setSelectedStats] = useState(null);
    const [selectedCourseInfo, setSelectedCourseInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch available course + examPeriod pairs
    useEffect(() => {
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
        setSelectedStats(null);
        setError(null);

        axios
            .get(`http://localhost:30032/api/stats/courses/${courseCode}/${encodeURIComponent(examPeriod)}`)
            .then((res) => {
                setSelectedStats(res.data);
                setSelectedCourseInfo({ courseCode, examPeriod });
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to load course statistics');
                setLoading(false);
            });
    };

    const getGradeDistributionData = () => {
        if (!selectedStats?.gradeDistribution) return [];
        return Object.entries(selectedStats.gradeDistribution).map(([grade, count]) => ({
            grade,
            count
        }));
    };

    const getPassFailPieData = () => {
        const averages = Object.values(selectedStats.questionAverages || {});
        const passed = averages.filter(avg => avg >= 5).length;
        const failed = averages.length - passed;

        return [
            { name: 'Passed', value: passed },
            { name: 'Failed', value: failed }
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
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map(({ courseCode, examPeriod }, index) => (
                        <tr key={index}>
                            <td>{courseCode}</td>
                            <td>{examPeriod}</td>
                            <td>
                                <button
                                    className={styles.button}
                                    onClick={() => handleViewStats(courseCode, examPeriod)}
                                >
                                    View Stats
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {loading && <p>Loading statistics...</p>}

                {selectedStats && (
                    <>
                        <h3 className={styles.subheading}>
                            Stats for {selectedCourseInfo.courseCode} – {selectedCourseInfo.examPeriod}
                        </h3>

                        <div className={styles.chartGrid}>
                            <div className={styles.chartBox}>
                                📊 Average Grade: {selectedStats.averageGrade ?? 'N/A'}
                            </div>

                            <div className={styles.chartBox} style={{ width: '100%', height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={getGradeDistributionData()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="grade" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {selectedStats.questionDistributions && selectedStats.questionAverages && (
                            <>
                                <h3 className={styles.subheading}>📊 Question Performance</h3>
                                <div className={styles.chartGrid}>
                                    {Object.entries(selectedStats.questionDistributions).map(([question, dist]) => {
                                        const data = Object.entries(dist).map(([score, count]) => ({
                                            score: Number(score),
                                            count
                                        }));
                                        const average = selectedStats.questionAverages[question];

                                        return (
                                            <div key={question} className={styles.chartBox} style={{ height: '250px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={data}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="score" />
                                                        <YAxis domain={[0, 'dataMax + 1']} />
                                                        <Tooltip />
                                                        <Bar dataKey="count" fill="#82ca9d" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                                <div style={{ textAlign: 'center', marginTop: '5px' }}>
                                                    {question} – Avg: {average.toFixed(2)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {selectedStats.questionAverages && (
                            <div className={styles.pieWrapper}>
                                <h3 className={styles.subheading}>✅ Pass vs ❌ Fail (Avg ≥ 5)</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={getPassFailPieData()}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >
                                            <Cell fill="#82ca9d" />
                                            <Cell fill="#ff6961" />
                                        </Pie>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default StudentStatisticsPage;
