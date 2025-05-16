// controllers/gradesController.js
const { Course, GradeEntry, QuestionGrade } = require('../models');
const { sequelize } = require('../models');

// POST /api/grades/upload
const uploadInitialGrades = async (req, res) => {
    const { courseMeta, gradeEntries, extractedUsers, skippedRows } = req;
    try {
        // 1. Find or create course
        const [course] = await Course.findOrCreate({
            where: {
                code: courseMeta.code,
                semester: courseMeta.semester
            },
            defaults: {
                title: courseMeta.title,
                question_weights: courseMeta.questionWeights
            }
        });

        // 2. Save each grade entry and its question grades
        for (const grade of gradeEntries) {
            const transaction = await sequelize.transaction();
            try {
                const gradeEntry = await GradeEntry.create({
                    course_id: course.id,
                    student_id: grade.studentId,
                    initial_grade: grade.initialGrade,
                    status: 'initial'
                }, { transaction });

                const questionGrades = Object.entries(grade.questionGrades).map(
                    ([questionId, score]) => ({
                        grade_entry_id: gradeEntry.id,
                        question_id: questionId,
                        initial_score: score,
                        status: 'initial'
                    })
                );

                await QuestionGrade.bulkCreate(questionGrades, { transaction });

                await transaction.commit(); // commit just this student
            } catch (err) {
                await transaction.rollback(); // rollback this one only
                console.error(`Failed to save grades for ${grade.studentId}`, err);
                // Optional: collect failed IDs to report
            }
        }

        res.status(201).json({
            message: 'Grades uploaded successfully',
            courseId: course.id,
            insertedGrades: courseMeta.gradesCount,
            skippedRows
        });

    } catch (err) {
        console.error('Upload failed:', err);
        res.status(500).json({ error: 'Failed to save grades' });
    }
};

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
const getStudentGrades = async (req, res) => {
    const { studentId } = req.params;
    try {
        const grades = await GradeEntry.findAll({
            where: { student_id: studentId },
            include: [
                {
                    model: Course,
                    attributes: ['code', 'title', 'semester', 'question_weights']
                },
                {
                    model: QuestionGrade,
                    attributes: ['question_id', 'initial_score', 'final_score', 'status']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formatted = grades.map(entry => {
            const questionWeights = entry.Course.question_weights || {};

            const questions = entry.QuestionGrades.map(q => ({
                question_id: q.question_id,
                initial_score: q.initial_score,
                final_score: q.final_score,
                status: q.status,
                weight: questionWeights[q.question_id] || null
            }));

            return {
                course: {
                    code: entry.Course.code,
                    title: entry.Course.title,
                    semester: entry.Course.semester
                },
                initial_grade: entry.initial_grade,
                final_grade: entry.final_grade,
                status: entry.status,
                questions
            };
        });

        res.status(200).json(formatted);

    } catch (err) {
        console.error('Failed to fetch student grades:', err);
        res.status(500).json({ error: 'Could not retrieve student grades' });
    }
};

module.exports = {
    uploadInitialGrades,
    getGrades,
    getStudentGrades
};
