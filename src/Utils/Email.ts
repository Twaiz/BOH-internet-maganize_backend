import nodemailer from 'nodemailer';

interface IOptions {
  email: string;
  subject: string;
  text: string;
}

const sendEmail = async (options: IOptions) => {
  const EMAIL_HOST = process.env['EMAIL_HOST'];
  const EMAIL_PORT = process.env['EMAIL_PORT'];
  const EMAIL_NAME = process.env['EMAIL_NAME'];
  const EMAIL_PASSWORD = process.env['EMAIL_PASSWORD'];
  const isNoneDefined =
    !EMAIL_HOST || !EMAIL_PORT || !EMAIL_NAME || !EMAIL_PASSWORD;

  const { email, subject, text } = options;

  if (isNoneDefined) {
    console.log('Email host or port or name or password is not defined.');
    return;
  }

  const port = parseInt(EMAIL_PORT, 10);

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: port,
    auth: {
      user: EMAIL_NAME,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Internet-magazine <internetMagazine@gmail.com>',
    to: email,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.log('Error sending email:', error);
  }
};

export { sendEmail };
