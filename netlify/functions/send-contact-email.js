"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }
    try {
        const { firstName, lastName, email, subject, message } = JSON.parse(event.body || '{}');
        if (!firstName || !lastName || !email || !subject || !message) {
            return {
                statusCode: 400,
                body: 'Missing required fields',
            };
        }
        // Configure your SMTP transport (use environment variables for security)
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        await transporter.sendMail({
            from: `Contact Form <${process.env.SMTP_USER}>`,
            to: 'slash.adbc@gmail.com',
            subject: `[Contact Form] ${subject}`,
            replyTo: email,
            text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
            html: `<p><strong>Name:</strong> ${firstName} ${lastName}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p>${message.replace(/\n/g, '<br/>')}</p>`,
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    }
    catch (err) {
        return {
            statusCode: 500,
            body: 'Failed to send email',
        };
    }
};
exports.handler = handler;
