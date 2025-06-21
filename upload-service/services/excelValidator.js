const xlsx = require('xlsx');
const path = require('path');

function excelValidator(file) {
    const ext = path.extname(file.originalname);
    if (ext !== '.xlsx') throw new Error('Invalid file type');

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 }).filter(
        row => Array.isArray(row) && row.some(cell => cell?.toString().trim() !== '')
    );

    if (rows.length < 4) throw new Error('Invalid file content: must have at least 4 rows');

    const courseLine = rows[0][0]?.toString().trim();
    const courseMatch = courseLine.match(/ΒΑΘΜΟΛΟΓΙΟ\s+(.+)\s+\((\d+)\)\s+(.+)/);
    if (!courseMatch) throw new Error('Invalid file content: course info format');

    const courseTitle = courseMatch[1].trim();
    const courseCode = courseMatch[2].trim();
    const courseSemester = courseMatch[3].trim();

    let validRows = 0;
    for (let i = 3; i < rows.length; i++) {
        const row = rows[i];
        const studentId = row[0]?.toString().trim();
        const grade = parseFloat(row[6]);
        const declaredSemester = row[3]?.toString().trim();
        if (studentId && !isNaN(grade) && declaredSemester) validRows++;
    }

    return {
        title: courseTitle,
        code: courseCode,
        semester: courseSemester,
        gradesCount: validRows
    };
}

module.exports = excelValidator;