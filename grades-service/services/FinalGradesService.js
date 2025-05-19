const { Course, InitialGrade, FinalGrade, sequelize } = require('../models');

async function findCourseId(courseMeta) {
    const course = await Course.findOne({
        where: {
            code: courseMeta.code,
            semester: courseMeta.semester
        }
    });
    return course?.id || null;
}

async function saveFinalGrades(courseId, gradeEntries) {
    const transaction = await sequelize.transaction();
    try {
        for (const entry of gradeEntries) {
            const { studentId, grade, questionGrades } = entry;

            // 1. Delete the existing initial grade (if it exists)
            const initialRecord = await InitialGrade.findOne({
                where: { course_id: courseId, student_id: studentId },
                transaction
            });

            const reviewed = initialRecord && initialRecord.grade !== grade;

            await InitialGrade.destroy({
                where: { course_id: courseId, student_id: studentId },
                transaction
            });

            // 2. Create final grade
            await FinalGrade.create({
                course_id: courseId,
                student_id: studentId,
                grade,
                question_grades: questionGrades,
                reviewed: reviewed || false
            }, { transaction });
        }

        // 3. Update course final_grades_submission_at
        await Course.update(
            { final_grades_submission_at: new Date() },
            { where: { id: courseId }, transaction }
        );

        await transaction.commit();
        console.log(`✅ Final grades saved for course ${courseId}`);
    } catch (err) {
        await transaction.rollback();
        console.error('❌ Failed to save final grades:', err);
        throw err;
    }
}

module.exports = {
    findCourseId,
    saveFinalGrades
};
