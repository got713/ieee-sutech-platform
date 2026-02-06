import nodemailer from "nodemailer";

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send certificate email
export const sendCertificateEmail = async (options) => {
  const { to, studentName, eventName, certificateUrl, pdfAttachment } = options;

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || "IEEE SUTECH <noreply@ieeesutech.com>",
    to: to,
    subject: `🎓 Your Certificate for ${eventName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎓 Congratulations!</h1>
        </div>
        <div class="content">
          <h2>Dear ${studentName},</h2>
          <p>Congratulations! You have been awarded a certificate for your participation in:</p>
          <h3 style="color: #667eea; text-align: center;">${eventName}</h3>
          <p>We are pleased to recognize your dedication and contribution to this event.</p>
          <p style="text-align: center;">
            <a href="${certificateUrl}" class="button">View Your Certificate Online</a>
          </p>
          <p>Your certificate is attached to this email as a PDF file. You can download, print, or share it as needed.</p>
          <p><strong>Important:</strong> Keep this certificate safe as proof of your achievement!</p>
        </div>
        <div class="footer">
          <p>IEEE SUTECH Student Branch</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `,
    attachments: pdfAttachment ? [
      {
        filename: `Certificate_${studentName.replace(/\s+/g, '_')}_${eventName.replace(/\s+/g, '_')}.pdf`,
        content: pdfAttachment,
        contentType: "application/pdf"
      }
    ] : []
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
};

// Send batch certificate emails
export const sendBatchCertificateEmails = async (certificates) => {
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  for (const cert of certificates) {
    try {
      const result = await sendCertificateEmail({
        to: cert.studentEmail,
        studentName: cert.studentName,
        eventName: cert.eventName,
        certificateUrl: cert.url,
        pdfAttachment: cert.pdfBuffer
      });

      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({
          email: cert.studentEmail,
          error: result.error
        });
      }
    } catch (error) {
      results.failed++;
      results.errors.push({
        email: cert.studentEmail,
        error: error.message
      });
    }
  }

  return results;
};
