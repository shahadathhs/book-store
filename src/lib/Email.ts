import config from 'config';
import nodemailer from 'nodemailer';
import { singleton } from 'tsyringe';
import { ConfigEnum } from './enum/config.enum';

@singleton()
export class Email {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.get(ConfigEnum.GMAIL_USER),
        pass: config.get(ConfigEnum.GMAIL_PASS),
      },
    });
  }

  async sendLoginOtp(email: string, otp: string) {
    const subject = 'Your Login OTP Code';
    const text = `Hello,

Here is your One-Time Password (OTP) to log in:

${otp}

This OTP will expire in 5 minutes. 
If you did not request this, please ignore this email.

Thanks,
The Team
`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">🔐 Login Verification</h2>
        <p>Hello,</p>
        <p>Here is your One-Time Password (OTP) to log in:</p>
        <h1 style="color: #4CAF50; letter-spacing: 2px;">${otp}</h1>
        <p>This OTP will expire in <strong>5 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br/>
        <p>Thanks,<br/>The Team</p>
      </div>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: `"Auth Service" <${ConfigEnum.GMAIL_USER}>`,
        to: email,
        subject,
        text,
        html,
      });

      console.info(`Login OTP email sent: ${info.messageId}`);
    } catch (err) {
      console.error('Error sending login OTP email:', err);
      throw err;
    }
  }
}
