// user-service/services/addUsersFromExcel.js
const User = require('../models/users');
const bcrypt = require('bcrypt');
const { sendWelcomeEmail } = require('./sendWelcomeEmail');

async function addUsersFromExcel(extractedUsers = []) {
    if (!Array.isArray(extractedUsers) || extractedUsers.length === 0) return;

    for (const u of extractedUsers) {
        const { id: academicId, name, email } = u;

        // Έλεγξε αν υπάρχει ήδη χρήστης με αυτό το email ή academicId
        const existingUser = await User.findOne({
            where: {
                email
            }
        });

        if (existingUser) {
            console.log(`ℹ️ User already exists: ${email}`);
            continue;
        }

        // Δημιουργία κωδικού (hashed academicId)
        const tempPassword = academicId || 'changeme123';
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        await User.create({
            name,
            email,
            academicId,
            password: hashedPassword,
            role: 'student',
            forcePasswordReset: true,
        });
    }
    console.log(`✅ Created new users from excel`);
}

module.exports = { addUsersFromExcel };
