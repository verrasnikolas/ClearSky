import React, { useEffect, useState } from 'react';
import styles from '../student/StudentStatisticsPage.module.css';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { getCourseStats, getAllCourses } from '../../services/StatsService';

const InstructorStatisticsPage = () => {
    const [courses, setCourses] = useState([]);
    const [selectedStats, setSelectedStats] = useState(null);
    const [selectedCourseInfo, setSelectedCourseInfo] = useState(null);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllCourses()
            .then((res) => setCourses(res.data))
            .catch((err) => {
                console.error(err);
                setError('Failed to load course list');
            })
            .finally(() => setLoadingCourses(false));
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            const options = {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
            };
            return date.toLocaleDateString(undefined, options);
        } catch {
            return 'Invalid Date';
        }
    };

    const handleViewStats = (courseCode, examPeriod) => {
        setLoading(true);
        setSelectedStats(null);
        setError(null);

        getCourseStats(courseCode, examPeriod)
            .then((res) => {
                const fetchedStats = res.data;
                setSelectedStats(fetchedStats);
                setSelectedCourseInfo({ courseCode, examPeriod });
                setCourses(prev =>
                    prev.map(course =>
                        course.courseCode === courseCode && course.examPeriod === examPeriod
                            ? {
                                ...course,
                                createdAt: fetchedStats.createdAt,
                                updatedAt: fetchedStats.updatedAt
                            }
                            : course
                    )
                );
            })
            .catch(() => setError('Failed to load course statistics'))
            .finally(() => setLoading(false));
    };

    const getGradeDistributionData = () => {
        if (!selectedStats?.gradeDistribution) return [];
        const dataMap = new Map();
        for (let i = 0; i <= 10; i++) dataMap.set(i, 0);
        Object.entries(selectedStats.gradeDistribution).forEach(([grade, count]) => {
            dataMap.set(parseInt(grade, 10), count);
        });
        return Array.from(dataMap.entries()).map(([grade, count]) => ({ grade, count }));
    };

    const getPassFailPieData = () => {
        const passed = selectedStats?.passCount ?? 0;
        const failed = selectedStats?.notPassCount ?? 0;
        const total = passed + failed;
        return [
            { name: 'Passed', value: passed, percentage: total ? ((passed / total) * 100).toFixed(1) : 0 },
            { name: 'Failed', value: failed, percentage: total ? ((failed / total) * 100).toFixed(1) : 0 }
        ];
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h2 className={styles.heading}>Available Course Statistics</h2>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {loadingCourses ? (
                <p>Loading course list...</p>
            ) : courses.length === 0 ? (
                <p>No courses available to display statistics for.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Exam Period</th>
                        <th>Initial Grades Upload</th>
                        <th>Final Grades Last Updated</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map((course, index) => (
                        <tr key={index}>
                            <td>{course.courseCode}</td>
                            <td>{course.courseName || 'N/A'}</td>
                            <td>{course.examPeriod}</td>
                            <td>{course.createdAt ? formatDate(course.createdAt) : 'N/A'}</td>
                            <td>
                                {course.createdAt && course.updatedAt &&
                                new Date(course.createdAt).getTime() === new Date(course.updatedAt).getTime()
                                    ? 'N/A'
                                    : (course.updatedAt ? formatDate(course.updatedAt) : 'N/A')}
                            </td>
                            <td>
                                <button className={styles.button} onClick={() =>
                                    handleViewStats(course.courseCode, course.examPeriod)}>
                                    View Stats
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {loading && <p>Loading statistics...</p>}

            {selectedStats && (
                <>
                    <h3 className={styles.subheading}>
                        Stats for {selectedCourseInfo.courseCode} – {selectedCourseInfo.examPeriod}
                    </h3>

                    <div className={styles.chartGrid}>
                        <div className={styles.chartBox}>
                            <h4>📊 Grade Distribution</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={getGradeDistributionData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="grade" domain={[0, 10]} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className={styles.chartBox}>
                            <h4>✅ Pass vs ❌ Fail</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={getPassFailPieData()}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        paddingAngle={3}
                                        minAngle={10}
                                    >
                                        <Cell fill="#82ca9d" />
                                        <Cell fill="#ff6961" />
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className={styles.passFailStats}>
                                <div className={styles.passStat}>
                                    ✅ Passed: {getPassFailPieData()[0].percentage}%
                                </div>
                                <div className={styles.failStat}>
                                    ❌ Failed: {getPassFailPieData()[1].percentage}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedStats.questionDistributions && selectedStats.questionAverages && (
                        <>
                            <h3 className={styles.subheading}>📊 Question Performance</h3>
                            <div className={styles.questionChartsGrid}>
                                {Object.entries(selectedStats.questionDistributions).map(([question, dist]) => {
                                    const data = Array.from({ length: 11 }, (_, i) => ({
                                        score: i,
                                        count: dist[i] ?? 0
                                    }));

                                    const average = selectedStats.questionAverages[question];

                                    return (
                                        <div key={question} className={styles.questionChartBox}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="score"
                                                        type="number"
                                                        domain={[0, 10]}
                                                        ticks={[...Array(11).keys()]}
                                                        interval={0}
                                                        padding={{ left: 20, right: 20 }}
                                                        tickMargin={5}
                                                    />
                                                    <YAxis domain={[0, 'dataMax + 1']} allowDecimals={false} />
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
    );
};

export default InstructorStatisticsPage;
