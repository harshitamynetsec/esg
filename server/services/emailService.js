import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let transporter = null;

if (env.smtp.host && env.smtp.user) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
}

export const sendInvitationEmail = async ({ to, firstName, setupUrl, companyName }) => {
  const subject = `Invitation to join ${companyName || 'ESG-NSS'}`;
  const text = `Hello ${firstName},\n\nYou have been invited to join ${companyName || 'ESG-NSS'}.\nPlease setup your password using the following link:\n${setupUrl}\n\nThis link will expire in 24 hours.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Welcome to ${companyName || 'ESG-NSS'}</h2>
      <p>Hello ${firstName},</p>
      <p>You have been invited to join <strong>${companyName || 'ESG-NSS'}</strong> team.</p>
      <p style="margin: 20px 0;">
        <a href="${setupUrl}" style="background-color: #0f766e; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Set Up Your Password</a>
      </p>
      <p style="color: #64748b; font-size: 12px;">This invitation link expires in 24 hours.</p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: env.smtp.from,
        to,
        subject,
        text,
        html,
      });
      logger.info(`Invitation email sent to ${to}`);
    } catch (err) {
      logger.error(`Failed to send invitation email to ${to}: ${err.message}`);
    }
  } else {
    logger.info(`[Email Service Stub] Invitation link generated for ${to}: ${setupUrl}`);
  }
};
