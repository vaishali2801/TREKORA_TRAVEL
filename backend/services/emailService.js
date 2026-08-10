import transporter from "../config/email.js";

/**
 * Sends an email via the configured SMTP transporter.
 * Errors are logged, never thrown (emails must not break API flows).
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Tour Package Management" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Email sending failed (${to}): ${error.message}`);
    return null;
  }
};

export default sendEmail;
