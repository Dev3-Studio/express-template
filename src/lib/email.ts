import { SendEmailV3_1 } from 'node-mailjet';
import { env } from '@/lib/env.ts';
import { fromEmail, fromName, resetPasswordTemplateId, verificationTemplateId } from '@/data/email.ts';
const Mailjet = require('node-mailjet');

const mailjet = new Mailjet({
    apiKey: env.MAILJET_API_KEY,
    apiSecret: env.MAILJET_SECRET,
});

export async function sendEmail(data: SendEmailV3_1.Body) {
    await mailjet
        .post('send', { version: 'v3.1' })
        .request(data);
}

export async function sendResetPasswordEmail(to: string, url: string) {
    const data: SendEmailV3_1.Body = {
        Messages: [{
            From: {
                Email: fromEmail,
                Name: fromName,
            },
            To: [{ Email: to }],
            TemplateID: resetPasswordTemplateId,
            TemplateLanguage: true,
            Variables: {
                resetLink: url,
            },
        }],
    };
    await sendEmail(data);
}

export async function sendVerificationEmail(to: string, url: string) {
    const data: SendEmailV3_1.Body = {
        Messages: [{
            From: {
                Email: fromEmail,
                Name: fromName,
            },
            To: [{ Email: to }],
            TemplateID: verificationTemplateId,
            TemplateLanguage: true,
            Variables: {
                verificationLink: url,
            },
        }],
    };
    await sendEmail(data);
}
