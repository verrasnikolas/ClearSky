// user-service/services/addUsersFromExcel.js
const User = require('../models/users');
const bcrypt = require('bcrypt');
const { sendWelcomeEmail } = require('./sendWelcomeEmail');

async function addUsersFromExcel(extractedUsers = []) {
    if (!Array.isArray(extractedUsers) || extractedUsers.length === 0) return;

    const transaction = await sequelize.transaction();
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

            await sendWelcomeEmail({ name, email, password: tempPassword }); // optionally move out of transaction
        }

        await transaction.commit();
        console.log(`🎉 Ολοκληρώθηκε η προσθήκη χρηστών από Excel`);
    } catch (err) {
        await transaction.rollback();
        console.error('❌ Failed to add users from Excel:', err.message);
        throw err;
    }
}

module.exports = { addUsersFromExcel };
