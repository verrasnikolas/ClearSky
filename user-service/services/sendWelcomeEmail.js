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
    console.log('[INFO] password (plaintext):', password);
    console.log('[INFO] name:', name);

    if (!email.endsWith('@mail.ntua.gr')) {
        console.log(`📭 Skipped sending email (non-NTUA): ${email}`);
        return;
    }

    // Αν έχεις το verify nodemailer έλεγχο, βάλε και αυτό πριν το sendMail:
    transporter.verify((error, success) => {
        if (error) {
            console.error('[❌ nodemailer VERIFY ERROR]', error);
        } else {
            console.log('[✅ nodemailer READY]');
        }
    });

    await transporter.sendMail({
        from: '"ClearSky" <clearskydemo@gmail.com>',
        to: email,
        subject: 'Ενεργοποίηση Λογαριασμού | ClearSky',
        text: `Γεια σου ${name}, ο κωδικός σου είναι: ${password}`, // fallback για απλό text clients
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px; color: #333;">
            <h2 style="color: #1976d2;">Καλωσήρθες στο <strong>ClearSky</strong>!</h2>
            <p>Γεια σου <strong>${name}</strong>,</p>
            <p>Ο κωδικός σου είναι:</p>
            <p style="font-size: 18px; font-weight: bold; color: #d32f2f;">${password}</p>
            <p>Εαν επιθυμείς να τον αλλάξεις επικοινώνησε με τη γραμματεία της σχολής σου.</p>
            <hr style="margin: 20px 0;" />
            <p style="font-size: 12px; color: #888;">Αυτό το email στάλθηκε αυτόματα. Παρακαλούμε μην απαντήσεις σε αυτό.</p>
        </div>
    `
    });

    console.log(`📤 Email sent to ${email}`);
}
module.exports = { sendWelcomeEmail };
