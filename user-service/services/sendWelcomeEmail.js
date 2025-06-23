const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,       // e.g. clearskydemo@gmail.com
        pass: process.env.EMAIL_PASSWORD,   // App password
    },
});

/**
 * Αποστολή welcome email με credentials στον φοιτητή
 */
async function sendWelcomeEmail({ name, email, password }) {
    console.log('[✅ sendWelcomeEmail CALLED]');
    console.log('[INFO] email:', email);
    console.log('[INFO] name:', name);

    if (!email.endsWith('@mail.ntua.gr')) {
        console.log(`📭 Skipped sending email (non-NTUA): ${email}`);
        return;
    }

    // Optional: verify the transporter — but safely
    try {
        await transporter.verify();
        console.log('[✅ nodemailer READY]');
    } catch (verifyErr) {
        console.warn('[⚠️ nodemailer VERIFY FAILED]', verifyErr.message);
        return; // or continue if you want to attempt send anyway
    }

    try {
        await transporter.sendMail({
            from: '"ClearSky" <clearskydemo@gmail.com>',
            to: email,
            subject: 'Ενεργοποίηση Λογαριασμού | ClearSky',
            text: `Γεια σου ${name}, ο κωδικός σου είναι: ${password}`,
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #eaf6ff; padding: 20px; color: #333;">
                    <h2 style="text-align: center; color: #1976d2;">Καλωσήρθες στο <strong>ClearSky</strong>!</h2>
                    <p>Γεια σου <strong>${name}</strong>,</p>
                    <p>Ο κωδικός σου είναι:</p>
                    <p style="font-weight: bold;">${password}</p>
                    <p>Εάν επιθυμείς να τον αλλάξεις, επικοινώνησε με τη γραμματεία της σχολής σου.</p>
                    <hr style="margin: 20px 0;" />
                    <p style="font-size: 12px; color: #888;">Αυτό το email στάλθηκε αυτόματα. Παρακαλούμε μην απαντήσεις σε αυτό.</p>
                </div>
            `
        });

        console.log(`📤 Email sent to ${email}`);
    } catch (sendErr) {
        console.warn(`⚠️ Email to ${email} failed: ${sendErr.message}`);
        // Do not throw — continue application flow
    }
}
module.exports = { sendWelcomeEmail };
