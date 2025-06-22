import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../student/StudentStatisticsPage.module.css';
import StudentNavbar from './StudentNavbar';
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
import { getCourseStats, getAllCourses } from '../../services/StatsService';

const InstructorStatisticsPage = () => {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    const [selectedStats, setSelectedStats] = useState(null);
    const [selectedCourseInfo, setSelectedCourseInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllCourses()
            .then((res) => setCourses(res.data))
            .catch((err) => {
                console.error(err);
                setError('Failed to load course list');
            })
            .finally(() => {
                setLoadingCourses(false); // Always set loading to false when fetch is complete
            });
    }, []);


    const handleGoToCourses = () => {

        navigate('/student/studentpage');

    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            return date.toLocaleDateString(undefined, options);
        } catch (e) {
            console.error("Error formatting date:", dateString, e);
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
                setCourses(prevCourses =>
                    prevCourses.map(course =>
                        course.courseCode === courseCode && course.examPeriod === examPeriod
                            ? {
                                ...course,
                                createdAt: fetchedStats.createdAt,
                                updatedAt: fetchedStats.updatedAt
                            }
                            : course
                    )
                );
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to load course statistics');
            })
            .finally(() => setLoading(false));
    };

    const getGradeDistributionData = () => {
        if (!selectedStats?.gradeDistribution) return [];
        return Object.entries(selectedStats.gradeDistribution).map(([grade, count]) => ({
            grade: parseInt(grade, 10),
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

    // Custom Label Renderer for Pie Chart
    const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name, value }) => {
        const RADIAN = Math.PI / 180;
        const radius = outerRadius * 1.5; // You might even increase this a bit if labels are still too close
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        const textAnchor = x > cx ? 'start' : 'end';

        return (
            <text
                x={x}
                y={y}
                fill="black"
                textAnchor={textAnchor}
                dominantBaseline="central"
                style={{
                    fontSize: '13px',
                    fontWeight: 'bold'
                }}
            >
                {`${(percent * 100).toFixed(1)}%`}
            </text>
        );
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

                {loadingCourses ? (
                    <p>Loading course list...</p>
                ) : (
                    courses.length === 0 ? (
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
                                            : (course.updatedAt ? formatDate(course.updatedAt) : 'N/A')
                                        }
                                    </td>
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
                    )
                )}

                {loading && <p>Loading statistics...</p>}

                {selectedStats && (
                    <>
                        <h3 className={styles.subheading}>
                            Stats for {selectedCourseInfo.courseCode} – {selectedCourseInfo.examPeriod}
                        </h3>

                        {/* Combined: Grade Distribution and Pie Chart */}
                        <div className={styles.chartGrid}>
                            <div className={styles.chartBox} style={{ height: '450px' }}>
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

                            {/* This is the Pie Chart's container */}
                            <div className={styles.chartBox} style={{ height: '450px', width: '500px' }}> {/* Increased width here */}
                                <h4>✅ Pass vs ❌ Fail (Avg ≥ 5)</h4>
                                <ResponsiveContainer width="100%" height="90%">
                                    <PieChart>
                                        <Pie
                                            data={getPassFailPieData()}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={70}
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            paddingAngle={3}
                                        >
                                            <Cell fill="#82ca9d" />
                                            <Cell fill="#ff6961" />
                                        </Pie>
                                        <Legend
                                            verticalAlign="top"
                                            align="center"
                                            height={36}
                                            wrapperStyle={{ paddingTop: '20px', paddingBottom: '10px' }}
                                        />
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