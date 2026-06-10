const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (email,username, token)=> {
    try {
    const info = await transporter.sendMail({
        from: '"EcoBazar" <md.alamin.cit.bd@gmail.com>', // sender address
        to: email, // list of recipients
        subject: "Verify your email",
        html: `<body style=margin:0;padding:0;background-color:#f4f7fa;font-family:Arial,sans-serif><table cellpadding=0 cellspacing=0 style="background-color:#f4f7fa;padding:40px 0"width=100%><tr><td align=center><table cellpadding=0 cellspacing=0 style=background:#fff;border-radius:12px;overflow:hidden width=600><tr><td align=center style=background:#2563eb;padding:30px><h1 style=color:#fff;margin:0;font-size:28px>Verify Your Email</h1><tr><td style="padding:40px 30px;color:#333"><h2 style=margin-top:0>Hello ${username || email},</h2><p style=font-size:16px;line-height:1.6>Thank you for signing up. Please verify your email address to activate your account.<div style="text-align:center;margin:35px 0"><a href=http://localhost:3000/${token} style="background:#2563eb;color:#fff;text-decoration:none;padding:14px 30px;border-radius:8px;display:inline-block;font-size:16px;font-weight:700">Verify Email</a></div><p style=font-size:14px;color:#666;line-height:1.6>If the button above doesn't work, copy and paste the following link into your browser:<p style=word-break:break-all><a href="http://localhost:3000/${token}">http://localhost:3000/${token}</a><p style=font-size:14px;color:#666>This verification link will expire in <strong>24 hours</strong>.<p style=font-size:14px;color:#666>If you didn't create an account, you can safely ignore this email.<tr><td align=center style=padding:20px;background:#f8fafc;color:#888;font-size:12px>© 2026 Your Company. All rights reserved.</table></table>`
    });

  console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
    console.error("Error while sending mail:", err);
    }
}

module.exports = sendEmail;