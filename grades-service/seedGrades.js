const Grades = require('./models/grades');  // Import directly
const sequelize = require('./config/db');

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to the database');

        // Sync the model with force: true (to recreate the table)
        await Grades.sync({ force: true }); // Try force sync if needed

        // Load Excel file
        const workbook = XLSX.readFile('./clearSKY data example 2 detailed.xlsx');
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(sheet);
        await Grades.bulkCreate(data);

        console.log('✅ Data uploaded successfully!');
    } catch (err) {
        console.error('❌ Error uploading data:', err);
        // console.log('DB_HOST:', process.env.DB_HOST);
        // console.log('DB_USER:', process.env.DB_USER);
        // console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
        // console.log('DB_NAME:', process.env.DB_NAME);
        // console.log('DB_PORT:', process.env.DB_PORT);

    } finally {
        await sequelize.close();
    }
};

seedDatabase();
