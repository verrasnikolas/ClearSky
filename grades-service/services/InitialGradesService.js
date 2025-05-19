const { Course, InitialGrade, sequelize } = require('../models');

async function findOrCreateCourse(courseMeta) {
    const [course] = await Course.findOrCreate({
        where: {
            code: courseMeta.code,
            semester: courseMeta.semester
        },
        defaults: {
            title: courseMeta.title,
            question_weights: courseMeta.questionWeights,
            instructor_id: courseMeta.instructorId // assuming this is passed
        }
    });
    return course;
}

async function saveInitialGrades(courseId, gradeEntries) {
    const transaction = await sequelize.transaction();
    try {
        const toInsert = gradeEntries.map(entry => ({
            course_id: courseId,
            student_id: entry.studentId,
            grade: entry.initialGrade,
            question_grades: entry.questionGrades
        }));

        await InitialGrade.bulkCreate(toInsert, { transaction });

        await Course.update(
            { initial_grades_submission_at: new Date() },
            { where: { id: courseId }, transaction }
        );

        await transaction.commit();
        console.log(`✅ Saved ${toInsert.length} initial grades for course ${courseId}`);
    } catch (err) {
        await transaction.rollback();
        console.error('❌ Failed to save initial grades:', err);
        throw err;
    }
}

module.exports = {
    findOrCreateCourse,
    saveInitialGrades
};
