"use server";

import { serverBookingSchema, serverContactSchema } from "@/lib/zod.schema";
import nodemailer from "nodemailer";

const getTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "SMTP credentials are not configured in environment variables (.env)",
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
};

export async function sendContactEmail(rawData: unknown) {
  try {
    // Validate inputs
    const data = serverContactSchema.parse(rawData);
    const transporter = getTransporter();
    const recipient = process.env.SMTP_USER; // Send to self

    const htmlContent = `
      <div style="font-family: Consolas, Monaco, 'Courier New', monospace; background-color: #0c0a09; color: #f2f2f3; padding: 24px; border: 2px solid #ea580c; max-width: 600px; margin: 0 auto; box-shadow: 6px 6px 0px #ea580c;">
        <div style="border-bottom: 2px solid #ea580c; padding-bottom: 12px; margin-bottom: 20px;">
          <span style="color: #ea580c; font-weight: bold; font-size: 14px; letter-spacing: 0.15em;">// ISHAK.BUILDS // CONTACT_TRANSMISSION</span>
        </div>
        
        <div style="margin-bottom: 20px; font-size: 12px; background-color: rgba(234, 88, 12, 0.05); padding: 12px; border-left: 4px solid #ea580c; line-height: 1.6;">
          <strong>STATUS:</strong> COMPILED_SMTP_DISPATCH<br/>
          <strong>TIMESTAMP:</strong> ${new Date().toISOString()}<br/>
          <strong>GATEWAY:</strong> GMAIL_SMTP_ROUTER
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 8px 0; color: #a8a29e; width: 140px; font-weight: bold;">SENDER_NAME</td>
            <td style="padding: 8px 0; color: #10b981; font-weight: bold;">"${data.senderName.replace(/"/g, '\\"')}"</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 8px 0; color: #a8a29e; font-weight: bold;">SENDER_EMAIL</td>
            <td style="padding: 8px 0; color: #10b981; font-weight: bold;">"${data.senderEmail.replace(/"/g, '\\"')}"</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 8px 0; color: #a8a29e; font-weight: bold;">PROJECT_SUBJECT</td>
            <td style="padding: 8px 0; color: #ea580c; font-weight: bold;">"${data.projectSubject.replace(/"/g, '\\"')}"</td>
          </tr>
        </table>

        <div style="margin-top: 20px; font-size: 13px;">
          <div style="color: #a8a29e; margin-bottom: 8px; font-weight: bold;">CLIENT_MESSAGE:</div>
          <div style="background-color: #1c1917; border: 1px solid #292524; padding: 16px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; color: #f5f5f4; font-family: inherit;">${data.clientMessage}</div>
        </div>

        <div style="margin-top: 30px; border-top: 1px dashed #292524; padding-top: 12px; font-size: 10px; color: #78716c; text-align: right; letter-spacing: 0.05em;">
          SECURE PACKET HANDSHAKE: COMPLETED (STATUS_200)
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"${data.senderName}" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: data.senderEmail,
      subject: `[Inquiry] ${data.projectSubject}`,
      text: `Sender: ${data.senderName} (${data.senderEmail})\nSubject: ${data.projectSubject}\n\nMessage:\n${data.clientMessage}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}

export async function sendBookingEmail(rawData: unknown) {
  try {
    // Validate inputs
    const data = serverBookingSchema.parse(rawData);
    const transporter = getTransporter();
    const recipient = process.env.SMTP_USER; // Send to self

    // Compile dynamic specs list
    const specsHtml = data.specs
      .map(
        (spec) =>
          `      <div style="color: #f5f5f4; padding-left: 16px;">&bull; "${spec.replace(/"/g, '\\"')}",</div>`,
      )
      .join("\n");

    const htmlContent = `
      <div style="font-family: Consolas, Monaco, 'Courier New', monospace; background-color: #0c0a09; color: #f2f2f3; padding: 24px; border: 2px solid #ea580c; max-width: 600px; margin: 0 auto; box-shadow: 6px 6px 0px #ea580c;">
        <div style="border-bottom: 2px solid #ea580c; padding-bottom: 12px; margin-bottom: 20px;">
          <span style="color: #ea580c; font-weight: bold; font-size: 14px; letter-spacing: 0.15em;">// ISHAK.BUILDS // BLUEPRINT_SPECIFICATION</span>
        </div>
        
        <div style="margin-bottom: 20px; font-size: 12px; background-color: rgba(234, 88, 12, 0.05); padding: 12px; border-left: 4px solid #ea580c; line-height: 1.6;">
          <strong>STATUS:</strong> BLUEPRINT_COMPILED<br/>
          <strong>TIMESTAMP:</strong> ${new Date().toISOString()}<br/>
          <strong>GATEWAY:</strong> GMAIL_SMTP_ROUTER
        </div>

        <h4 style="color: #ea580c; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">[ 01_CLIENT_IDENTITY ]</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 6px 0; color: #a8a29e; width: 180px; font-weight: bold;">CLIENT_NAME</td>
            <td style="padding: 6px 0; color: #10b981; font-weight: bold;">"${data.name.replace(/"/g, '\\"')}"</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 6px 0; color: #a8a29e; font-weight: bold;">CLIENT_EMAIL</td>
            <td style="padding: 6px 0; color: #10b981; font-weight: bold;">"${data.email.replace(/"/g, '\\"')}"</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 6px 0; color: #a8a29e; font-weight: bold;">ORGANIZATION</td>
            <td style="padding: 6px 0; color: #f5f5f4;">${data.company ? `"${data.company.replace(/"/g, '\\"')}"` : "NULL"}</td>
          </tr>
        </table>

        <h4 style="color: #ea580c; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">[ 02_SCOPE_PARAMETERS ]</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 6px 0; color: #a8a29e; width: 180px; font-weight: bold;">BUDGET_LIMIT</td>
            <td style="padding: 6px 0; color: #f5f5f4; font-weight: bold;">${data.budget}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 6px 0; color: #a8a29e; font-weight: bold;">CUSTOM_OFFER</td>
            <td style="padding: 6px 0; color: #10b981;">${data.customBudget ? `₹${data.customBudget}` : "NULL"}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 6px 0; color: #a8a29e; font-weight: bold;">TARGET_TIMELINE</td>
            <td style="padding: 6px 0; color: #f5f5f4; font-weight: bold;">${data.timeline}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 6px 0; color: #a8a29e; font-weight: bold;">CUSTOM_TIMELINE</td>
            <td style="padding: 6px 0; color: #10b981;">${data.customTimeline ? `"${data.customTimeline.replace(/"/g, '\\"')}"` : "NULL"}</td>
          </tr>
        </table>

        <h4 style="color: #ea580c; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">[ 03_ENGINEERING_SPECS ]</h4>
        <div style="background-color: #1c1917; border: 1px solid #292524; padding: 12px; margin-bottom: 20px; font-size: 13px; line-height: 1.5;">
          <div style="color: #10b981; font-weight: bold; margin-bottom: 4px;">selected_modules = [</div>
          ${specsHtml}
          <div style="color: #10b981; font-weight: bold;">]</div>
        </div>

        ${
          data.customMessage
            ? `
        <h4 style="color: #ea580c; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">[ 04_CUSTOM_REQUIREMENTS ]</h4>
        <div style="background-color: #1c1917; border: 1px solid #292524; padding: 16px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; color: #f5f5f4; font-family: inherit;">${data.customMessage}</div>
        `
            : ""
        }

        <div style="margin-top: 30px; border-top: 1px dashed #292524; padding-top: 12px; font-size: 10px; color: #78716c; text-align: right; letter-spacing: 0.05em;">
          SECURE BLUEPRINT TRANSACTION: COMPLETED (STATUS_200)
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"${data.name}" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: data.email,
      subject: `[Booking] Launchpad Booking from ${data.name}`,
      text: `Client: ${data.name} (${data.email})\nCompany: ${data.company || "None"}\nBudget: ${data.budget}\nCustom Budget: ${data.customBudget || "None"}\nTimeline: ${data.timeline}\nCustom Timeline: ${data.customTimeline || "None"}\nSpecs: ${data.specs.join(", ")}\n\nMessage:\n${data.customMessage || "None"}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errMessage };
  }
}
