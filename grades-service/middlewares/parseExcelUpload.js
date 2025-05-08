const xlsx = require('xlsx');
const path = require('path');

const parseExcelUpload = (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const ext = path.extname(file.originalname);
        if (ext !== '.xlsx') {
            return res.status(400).json({ error: 'Invalid file type. Only .xlsx allowed.' });
        }

        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 }).filter(
            (row) => Array.isArray(row) && row.some(cell => cell !== undefined && cell !== null && cell.toString().trim() !== '')
        );

        if (rows.length < 4) {
            return res.status(400).json({ error: 'Excel must have at least 4 rows' });
        }

        // === Row 0: Course Info
        const courseLine = rows[0][0]?.toString().trim();
        console.log('Course line:', courseLine); // log to see the actual value

        const courseMatch = courseLine.match(/ΒΑΘΜΟΛΟΓΙΟ\s+(.+)\s+\((\d+)\)\s+(.+)/);

        if (!courseMatch) {
            return res.status(400).json({ error: 'Invalid course info format in first row' });
        }

        const courseTitle = courseMatch[1].trim();     // e.g. "ΤΕΧΝΟΛΟΓΙΑ ΛΟΓΙΣΜΙΚΟΥ"
        const courseCode = courseMatch[2].trim();      // e.g. "3205"
        const courseSemester = courseMatch[3].trim();  // e.g. "2024-2025 Χειμερινή"

        // === Row 1: Question Weights
        const headersRow = rows[0]; // Example: [ "Αριθμός Μητρώου", ..., "W01", "W02", ... ]
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

        // === Row 4+: Grades Extraction
        const questionIds = Object.keys(questionWeights);
        const gradeEntries = [];
        const extractedUsers = [];
        const skippedRows = [];

        for (let i = 3; i < rows.length; i++) {
            const row = rows[i];

            const studentId = row[0]?.toString().trim(); // Αριθμός Μητρώου
            const fullName = row[1]?.toString().trim();
            const email = row[2]?.toString().trim();
            const declaredSemester = row[3]?.toString().trim();
            if (!declaredSemester || typeof declaredSemester !== 'string') {
                skippedRows.push({ row: i + 1, reason: 'Missing or invalid declaration period', studentId });
                continue;
            }

            const trimmedDeclared = declaredSemester.split(' ').slice(0, 2).join(' ').toLowerCase();
            const normalizedCourseSemester = courseSemester.toLowerCase();
            const declaredCourse = row[4]?.toString().trim();   // Τμήμα Τάξης
            const gradingScale = row[5]?.toString().trim();
            const initialGrade = parseFloat(row[6]);

            // === Check title & semester match

            if (!studentId || isNaN(initialGrade)) {
                skippedRows.push({ row: i + 1, reason: 'Invalid studentId or missing grade'});
                continue;
            }

            if (!normalizedCourseSemester.includes(trimmedDeclared)) {
                skippedRows.push({ row: i + 1, reason: 'Different declared semester to course semester.', trimmedDeclared , normalizedCourseSemester });
                continue;
            }

            if (!declaredCourse.includes(courseTitle)) {
                skippedRows.push({ row: i + 1, reason: 'Different declared and course title', declaredCourse, courseTitle });
                continue;
            }

            // === Extract per-question grades
            const questionGrades = {};
            questionIds.forEach((qid, idx) => {
                const score = parseFloat(row[8 + idx]); // Assuming Q01 starts at col 8 (index 7)
                questionGrades[qid] = isNaN(score) ? null : score;
            });

            // === Build grade entries
            gradeEntries.push({
                studentId,
                initialGrade,
                questionGrades
            });

            // === Track user for account creation
            extractedUsers.push({
                id: studentId,
                name: fullName,
                email
            });
        }

        req.courseMeta = {
            code: courseCode,
            title: courseTitle,
            courseSemester,
            questionWeights,
            gradesCount: gradeEntries.length
        };
        req.gradeEntries = gradeEntries;
        req.extractedUsers = extractedUsers;
        req.skippedRows = skippedRows;

        next(); // continue to controller

    } catch (err) {
        console.error('Excel validation failed:', err);
        res.status(500).json({ error: 'Failed to parse Excel file' });
    }
};

module.exports = parseExcelUpload;
