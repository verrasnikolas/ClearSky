const xlsx = require('xlsx');
const path = require('path');

function parseExcel(file, instructorId) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 }).filter(
        (row) => Array.isArray(row) && row.some(cell => cell !== undefined && cell !== null && cell.toString().trim() !== '')
    );

    // === Extract metadata and grade entries ===
    const courseLine = rows[0][0]?.toString().trim();
    const courseMatch = courseLine.match(/ΒΑΘΜΟΛΟΓΙΟ\s+(.+)\s+\((\d+)\)\s+(.+)/);
    if (!courseMatch) throw new Error('Invalid course info format');

    const courseTitle = courseMatch[1].trim();
    const courseCode = courseMatch[2].trim();
    const courseSemester = courseMatch[3].trim();

    const headersRow = rows[0];
    const weightsRow = rows[1];
    const questionWeights = {};
    for (let i = 0; i < headersRow.length; i++) {
        const header = headersRow[i];
        if (typeof header === 'string' && header.startsWith('W')) {
            const questionId = 'Q' + header.substring(1);
            const weight = parseFloat(weightsRow[i]);
            if (!isNaN(weight)) {
                questionWeights[questionId] = weight;
            }
        }
    }

    const questionIds = Object.keys(questionWeights);
    const gradeEntries = [];
    const extractedUsers = [];
    const skippedRows = [];

    for (let i = 3; i < rows.length; i++) {
        const row = rows[i];
        const studentId = row[0]?.toString().trim();
        const fullName = row[1]?.toString().trim();
        const email = row[2]?.toString().trim();
        const declaredSemester = row[3]?.toString().trim();
        const declaredCourse = row[4]?.toString().trim();
        const grade = parseFloat(row[6]);

        if (!studentId || isNaN(grade) || !declaredSemester) {
            skippedRows.push({ row: i + 1, reason: 'Missing required fields', studentId });
            continue;
        }

        const trimmedDeclared = declaredSemester.split(' ').slice(0, 2).join(' ').toLowerCase();
        const normalizedCourseSemester = courseSemester.toLowerCase();

        if (!normalizedCourseSemester.includes(trimmedDeclared)) {
            skippedRows.push({ row: i + 1, reason: 'Mismatched semesters' });
            continue;
        }

        if (!declaredCourse.includes(courseTitle)) {
            skippedRows.push({ row: i + 1, reason: 'Mismatched course title' });
            continue;
        }

        const questionGrades = {};
        questionIds.forEach((qid, idx) => {
            const score = parseFloat(row[8 + idx]);
            questionGrades[qid] = isNaN(score) ? null : score;
        });

        gradeEntries.push({ studentId, grade, questionGrades });
        extractedUsers.push({ id: studentId, name: fullName, email });
    }

    return {
        courseMeta: {
            code: courseCode,
            title: courseTitle,
            semester: courseSemester,
            questionWeights,
            instructorId,
            gradesCount: gradeEntries.length
        },
        gradeEntries,
        extractedUsers,
        skippedRows
    };
}

module.exports = parseExcel;
