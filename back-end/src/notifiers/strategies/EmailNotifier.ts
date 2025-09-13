import nodemailer from 'nodemailer';
import { NotifierInterface } from './NotifierInterface';
import { PriceAlertData } from '../PriceAlertDataInterface';
import { Logger } from '../../utils/Logger';

export class EmailNotifier implements NotifierInterface {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (
      !process.env.EMAIL_HOST ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      Logger.error('Email configuration is missing in environment variables');
      throw new Error(
        'Email configuration is missing in environment variables'
      );
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  public async notify(alertData: PriceAlertData): Promise<void> {
    const htmlBody = this.createHtmlTemplate(alertData);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.NOTIFY_EMAIL_TO,
      subject: `Price Alert: ${alertData.productName} is cheaper now!`,
      html: htmlBody,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      Logger.info(
        `Email sent: ${info.messageId} for product ${alertData.productName}`
      );
    } catch (error) {
      Logger.error(
        `Failed to send email for product ${alertData.productName}: ${
          error instanceof Error ? `${error.name} - ${error.message}` : ''
        }`,
        error instanceof Error ? error.stack : undefined
      );

      throw error;
    }
  }

  private createHtmlTemplate(data: PriceAlertData): string {
    const currentPriceFormatted = `$ ${data.currentPrice
      .toFixed(2)
      .replace('.', ',')}`;
    const targetPriceFormatted = `$ ${data.targetPrice
      .toFixed(2)
      .replace('.', ',')}`;

    return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
      .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
      .header { background-color: #28a745; color: #ffffff; padding: 20px; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; }
      .content { padding: 30px; line-height: 1.6; color: #333333; }
      .content h2 { color: #0056b3; }
      .price-box { border: 1px solid #dddddd; padding: 15px; margin-top: 20px; border-radius: 5px; text-align: center; }
      .price-box .label { font-size: 14px; color: #666666; }
      .price-box .price { font-size: 28px; font-weight: bold; color: #28a745; margin: 5px 0; }
      .cta-button { display: block; width: 200px; margin: 30px auto; padding: 15px 20px; background-color: #007bff; color: #ffffff; text-align: center; text-decoration: none; border-radius: 5px; font-weight: bold; }
      .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666666; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Price alert!</h1>
      </div>
      <div class="content">
        <p>Hello!</p>
        <p>Great news! The product you’re tracking has reached your desired price:</p>
        <h2>${data.productName}</h2>
        <p>Sold by: <strong>${data.storeName}</strong></p>
        
        <div class="price-box">
          <div class="label">Current Price</div>
          <div class="price">${currentPriceFormatted}</div>
          <div class="label" style="font-size: 12px;">Your target was ${targetPriceFormatted}</div>
        </div>

        <a href="${data.url}" class="cta-button">Check Offer Now</a>
        
        <p>Hurry up, prices may change at any time!</p>
      </div>
      <div class="footer">
        <p>You received this email because you created an alert in our system.</p>
        <p>&copy; ${new Date().getFullYear()} Your Alerts App</p>
      </div>
    </div>
  </body>
  </html>
`;
  }
}
