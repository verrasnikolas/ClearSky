// user-service/services/addUsersFromExcel.js
const User = require('../models/users');
const bcrypt = require('bcrypt');
const { sendWelcomeEmail } = require('./sendWelcomeEmail');
const sequelize = require('../config/database.js');

async function addUsersFromExcel(extractedUsers = []) {
    if (!Array.isArray(extractedUsers) || extractedUsers.length === 0) return;

    const transaction = await sequelize.transaction();
    const welcomeEmailQueue = [];

    try {
        for (const u of extractedUsers) {
            const { id: academicId, name, email } = u;
            const username = email.split('@')[0];
            const tempPassword = academicId || 'changeme123';
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            const existingUser = await User.findOne({ where: { email }, transaction });
            if (existingUser) {
                console.log(`User already exists: ${email}`);
                continue;
            }

            await User.create({
                name,
                email,
                academicId,
                username,
                password: hashedPassword,
                role: 'student',
                forcePasswordReset: true,
            }, { transaction });

            welcomeEmailQueue.push({ name, email, password: tempPassword });
        }

        await transaction.commit();
        console.log(`🎉 Ολοκληρώθηκε η προσθήκη χρηστών από Excel`);
    } catch (err) {
        await transaction.rollback();
        console.error('❌ Failed to add users from Excel:', err.message);
        throw err;
    }

    // Batch send emails concurrently
    const emailResults = await Promise.allSettled(
        welcomeEmailQueue.map(user => sendWelcomeEmail(user))
    );

    emailResults.forEach((result, index) => {
        const user = welcomeEmailQueue[index];
        if (result.status === 'fulfilled') {
            console.log(`✅ Email sent to ${user.email}`);
        } else {
            console.error(`❌ Failed to send email to ${user.email}:`, result.reason);
        }
    });
}


module.exports = { addUsersFromExcel };
