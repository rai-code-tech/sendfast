import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: parseInt(process.env.SMTP_PORT || "1025"),
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

export async function sendTransferEmail({
  to,
  senderName,
  transferUrl,
  message,
  fileCount,
  totalSize,
}: {
  to: string;
  senderName: string;
  transferUrl: string;
  message?: string;
  fileCount: number;
  totalSize: string;
}) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@sendfast.dev",
    to,
    subject: `${senderName} sent you ${fileCount} file${fileCount > 1 ? "s" : ""} via SendFast`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10b981;">SendFast</h2>
        <p><strong>${senderName}</strong> sent you ${fileCount} file${fileCount > 1 ? "s" : ""} (${totalSize})</p>
        ${message ? `<p style="color: #666; border-left: 3px solid #10b981; padding-left: 12px;">${message}</p>` : ""}
        <a href="${transferUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #14b8a6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
          Download Files
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">Sent via SendFast — fast, encrypted file transfers</p>
      </div>
    `,
  });
}
