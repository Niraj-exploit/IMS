const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'saugatsharma610@gmail.com', // Your Gmail email address
    pass: 'jgnvuincoqehmzeo',     // Use the App Password you generated
  },
});

// Define email data and send an email
const mailOptions = {
  from: 'saugatsharma610@gmail.com',
  to: 'saugatsharma9813@gmail.com',
  subject: 'Hello from Nodemailer',
  text: 'This is a test email sent using Nodemailer with Gmail.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
