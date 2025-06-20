// controllers/gradesController.js
const { Course, InitialGrade, FinalGrade } = require('../models');

// GET /api/grades/
const getGrades = async (req, res) => {
    try {
        res.status(200).json(grades);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// GET /api/grades/student/:studentId
const getStudentGradedCourses = async (req, res) => {
    const studentId = req.studentId
    try {
        const initialGrades = await InitialGrade.findAll({
            where: { student_id: studentId },
            include: [{ model: Course }],
            raw: true,
            nest: true
        });
        const finalGrades = await FinalGrade.findAll({
            where: { student_id: studentId },
            include: [{ model: Course }],
            raw: true,
            nest: true
        });

        const courseMap = new Map();
        for (const grade of finalGrades) {
            const key = grade.course_id;
            courseMap.set(key, {
                course_id: key,
                course_name: grade.Course.title,
                semester: grade.Course.semester,
                grading_status: 'closed'
            });
        }
        for (const grade of initialGrades) {
            const key = grade.course_id;
            if (!courseMap.has(key)) {
                courseMap.set(key, {
                    course_id: key,
                    course_name: grade.Course.title,
                    semester: grade.Course.semester,
                    grading_status: 'open'
                });
            }
        }

        const courseList = Array.from(courseMap.values());
        res.status(200).json(courseList);
    } catch (error) {
        console.error('❌ Error fetching graded courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getStudentGradeForCourse = async (req, res) => {
    const studentId = req.studentId
    const courseId = req.params.courseId;

    try {
        const initialGrade = await InitialGrade.findOne({
            where: { student_id: studentId, course_id: courseId },
            raw: true
        });

        if (initialGrade) {
            return res.status(200).json({...initialGrade});
        }

        const finalGrade = await FinalGrade.findOne({
            where: { student_id: studentId, course_id: courseId },
            raw: true
        });

        if (finalGrade) {
            return res.status(200).json({...finalGrade});
        }

        return res.status(404).json({ error: 'No grade found for this student in the given course.' });
    } catch (err) {
        console.error('❌ Failed to get specific grade:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    getStudentGradedCourses,
    getGrades,
    getStudentGradeForCourse
};
