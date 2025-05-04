const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const validateExcelFile = (req, res, next) => {
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
        const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

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

        const title = courseMatch[1].trim();     // e.g. "ΤΕΧΝΟΛΟΓΙΑ ΛΟΓΙΣΜΙΚΟΥ"
        const code = courseMatch[2].trim();      // e.g. "3205"
        const semester = courseMatch[3].trim();  // e.g. "2024-2025 Χειμερινή"

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

        // === Total number of grades
        const gradesCount = rows.slice(3).length; // from row 4 onward

        // Attach to request
        req.courseMeta = {
            code,
            title,
            semester,
            questionWeights,
            gradesCount
        };

        next(); // continue to controller

    } catch (err) {
        console.error('Excel validation failed:', err);
        res.status(500).json({ error: 'Failed to parse Excel file' });
    }
};

module.exports = validateExcelFile;
