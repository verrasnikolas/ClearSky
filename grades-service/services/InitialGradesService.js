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

async function saveInitialGrades(courseId, gradeEntries, batchId) {
    const transaction = await sequelize.transaction();
    try {
        const toInsert = gradeEntries.map(entry => ({
            course_id: courseId,
            student_id: entry.studentId,
            grade: entry.grade,
            question_grades: entry.questionGrades,
            batch_id: batchId
        }));

        await InitialGrade.bulkCreate(toInsert, {
            transaction,
            ignoreDuplicates: true // This will prevent errors on duplicates and simply skip them
        });

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

async function getCourseIdByBatchId(batchId) {
    const grade = await InitialGrade.findOne({ where: { batch_id: batchId } });
    if (!grade) {
        return null;
    }
    return grade.course_id;
}


async function deleteInitialGradesByBatchId(batchId) {
    try {
        const numDeletedRows = await InitialGrade.destroy({
            where: {
                batch_id: batchId
            }
        });

        if (numDeletedRows > 0) {
            console.log(`[Grades Service] Successfully deleted ${numDeletedRows} initial grades for batch ID: ${batchId}`);
        } else {
            console.log(`[Grades Service] No initial grades found for batch ID: ${batchId} to delete (or already deleted).`);
        }

    } catch (error) {
        console.error(`[Grades Service] Error deleting initial grades for batch ID ${batchId}:`, error);
        throw error;
    }
}

async function ConditionallyDeleteCourse(courseId) {
    try {
        const count = await InitialGrade.count({ where: { course_id: courseId } });
        if (count === 0) {
            await Course.destroy({where: {id: courseId}});
        }
        console.log(`[Grades Service] No remaining grades for course ${courseId}. Course deleted.`);
    }
    catch (error)
    {
        console.log(`[Grades Service] ${remainingCount} grades remain for course ${courseId}. Course kept.`);
        throw error;
    }
}

module.exports = {
    findOrCreateCourse,
    saveInitialGrades,
    deleteInitialGradesByBatchId,
    getCourseIdByBatchId,
    ConditionallyDeleteCourse
};
