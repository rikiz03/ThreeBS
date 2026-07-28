/**
 * Utility to send instant purchase notifications to the store owner via Email.
 * Uses Nodemailer with Gmail SMTP (or any SMTP provider).
 */

import nodemailer from 'nodemailer';

interface OrderNotificationData {
    orderId: string;
    total: number;
    fullName: string;
    city: string;
    countryCode: string;
    items: Array<{ title: string; quantity: number }>;
}

function createTransporter() {
    const emailUser = process.env.NOTIFICATION_EMAIL_USER;
    const emailPass = process.env.NOTIFICATION_EMAIL_PASS;
    const emailHost = process.env.NOTIFICATION_EMAIL_HOST || 'smtp.gmail.com';
    const emailPort = parseInt(process.env.NOTIFICATION_EMAIL_PORT || '587');

    if (!emailUser || !emailPass) {
        return null;
    }

    return nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: emailPort === 465,
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });
}

function buildOrderEmailHtml(data: OrderNotificationData): string {
    const itemsList = data.items
        .map(item => `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${item.title}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td></tr>`)
        .join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 24px; }
        .header p { color: rgba(255,255,255,0.8); margin: 5px 0 0; }
        .content { padding: 30px; }
        .order-details { background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .order-details h2 { margin: 0 0 15px; font-size: 18px; color: #333; }
        .detail-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
        .detail-row:last-child { border-bottom: none; }
        .label { color: #666; font-size: 14px; }
        .value { color: #333; font-weight: bold; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #667eea; color: #fff; padding: 10px 8px; text-align: left; font-size: 13px; }
        th:last-child { text-align: center; }
        .total-row { background: #e8f4f8; font-weight: bold; }
        .total-row td { padding: 12px 8px; font-size: 16px; }
        .footer { padding: 20px 30px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 New Order Received!</h1>
            <p>Three Brothers' Stores - Order Notification</p>
        </div>
        <div class="content">
            <div class="order-details">
                <h2>Order Summary</h2>
                <div class="detail-row">
                    <span class="label">Order ID</span>
                    <span class="value">${data.orderId}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Total Amount</span>
                    <span class="value">$${data.total.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Customer</span>
                    <span class="value">${data.fullName}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Location</span>
                    <span class="value">${data.city}, ${data.countryCode}</span>
                </div>
            </div>

            <h2 style="font-size:16px;color:#333;margin-bottom:10px;">Items Purchased</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th style="text-align:center;">Qty</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsList || '<tr><td colspan="2" style="padding:10px;text-align:center;color:#999;">No items data available</td></tr>'}
                </tbody>
            </table>
        </div>
        <div class="footer">
            <p>Three Brothers' Stores &bull; Order Notification System</p>
            <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`;
}

export async function sendEmailNotification(data: OrderNotificationData) {
    const transporter = createTransporter();
    const notificationEmail = process.env.NOTIFICATION_EMAIL_TO || process.env.NOTIFICATION_EMAIL_USER;

    if (!transporter || !notificationEmail) {
        console.warn('Email notifications skipped: NOTIFICATION_EMAIL_USER or NOTIFICATION_EMAIL_PASS missing.');
        console.warn('To enable email notifications, add these to .env.local:');
        console.warn('  NOTIFICATION_EMAIL_USER=your_email@gmail.com');
        console.warn('  NOTIFICATION_EMAIL_PASS=your_app_password');
        console.warn('  NOTIFICATION_EMAIL_TO=store_owner@example.com (optional, defaults to NOTIFICATION_EMAIL_USER)');
        return;
    }

    const htmlContent = buildOrderEmailHtml(data);

    try {
        const info = await transporter.sendMail({
            from: `"Three Brothers' Stores" <${process.env.NOTIFICATION_EMAIL_USER}>`,
            to: notificationEmail,
            subject: `🚀 New Order! ${data.orderId} - $${data.total.toFixed(2)}`,
            html: htmlContent,
        });

        console.log(`Email notification sent: ${info.messageId}`);
    } catch (error) {
        console.error('Email notification failed:', error);
    }
}
