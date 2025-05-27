import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../student/StudentStatisticsPage.module.css';
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

const InstructorStatisticsPage = () => {
    // const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedStats, setSelectedStats] = useState(null);
    const [selectedCourseInfo, setSelectedCourseInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get('http://localhost:30032/api/stats/all-courses')
            .then((res) => setCourses(res.data))
            .catch((err) => {
                console.error(err);
                setError('Failed to load course list');
            });
    }, []);

    // const handleGoToCourses = () => {
    //     navigate('/student/studentpage');
    // };

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
        const passed = selectedStats.passCount ?? 0;
        const failed = selectedStats.notPassCount ?? 0;
        const total = passed + failed;

        return [
            {
                name: 'Passed',
                value: passed,
                percentage: total ? ((passed / total) * 100).toFixed(1) : 0
            },
            {
                name: 'Failed',
                value: failed,
                percentage: total ? ((failed / total) * 100).toFixed(1) : 0
            }
        ];
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.headerRow}>
                    <h2 className={styles.heading}>Available Course Statistics</h2>
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

                        {/* Combined: Grade Distribution and Pie Chart */}
                        <div className={styles.chartGrid}>
                            <div className={styles.chartBox} style={{ height: '300px' }}>
                                <h4>📊 Grade Distribution</h4>
                                <ResponsiveContainer width="100%" height="90%">
                                    <BarChart data={getGradeDistributionData()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="grade"
                                            type="number"
                                            domain={[0, 10]}
                                            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                        />
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
                                            <Cell fill="#82ca9d" />
                                            <Cell fill="#ff6961" />
                                        </Pie>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Question-Level Charts */}
                        {selectedStats.questionDistributions && selectedStats.questionAverages && (
                            <>
                                <h3 className={styles.subheading}>📊 Question Performance</h3>
                                <div className={styles.chartGrid}>
                                    {Object.entries(selectedStats.questionDistributions).map(([question, dist]) => {
                                        const data = Array.from({ length: 11 }, (_, i) => ({
                                            score: i,
                                            count: dist[i] ?? 0
                                        }));

                                        const average = selectedStats.questionAverages[question];

                                        return (
                                            <div key={question} className={styles.chartBox} style={{ height: '250px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={data}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis
                                                            dataKey="score"
                                                            type="number"
                                                            domain={[0, 10]}
                                                            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                                        />
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
                    </>
                )}
            </div>
        </>
    );
};

export default InstructorStatisticsPage;
