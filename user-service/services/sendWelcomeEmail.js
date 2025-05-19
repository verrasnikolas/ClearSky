async function sendWelcomeEmail({ name, email, password }) {
    // MOC αποστολή mail (απλή εκτύπωση στο τερματικό)
    console.log(`📧 Email sent to ${email}:
    Καλώς ήρθες ${name}!
    Μπορείς να συνδεθείς με:
    Email: ${email}
    Κωδικός: ${password}

    Παρακαλούμε άλλαξε τον κωδικό σου στην πρώτη σου σύνδεση.
    `);
}

module.exports = { sendWelcomeEmail };

/* FOR REAL EMAIL
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

async function sendWelcomeEmail({ name, email, password }) {
    await transporter.sendMail({
        from: '"ClearSky" <clearskydemo@gmail.com>',
        to: email,
        subject: 'Ενεργοποίηση Λογαριασμού | ClearSky',
        text: `Γεια σου ${name},\nΟ προσωρινός σου κωδικός είναι: ${password}\nΠαρακαλώ άλλαξέ τον στην πρώτη σου σύνδεση.`,
    });

    console.log(`📤 Email sent to ${email}`);
}

module.exports = { sendWelcomeEmail };
 */