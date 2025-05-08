// controllers/gradesController.js

const { Course, GradeEntry, QuestionGrade } = require('../models');
const { sequelize } = require('../models');

// POST /api/grades/upload
const uploadInitialGrades = async (req, res) => {
    const { courseMeta, gradeEntries, extractedUsers, skippedRows } = req;

    try {
        // 1. Find or create the course
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

        // 3. Stub for calling user-service (for later)
        // await axios.post('http://user-service/api/users/bulk-create', {
        //   users: extractedUsers
        // });

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

module.exports = { uploadInitialGrades, getGrades };
