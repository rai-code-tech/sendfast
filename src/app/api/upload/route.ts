import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { getPresignedUploadUrl } from "@/lib/s3";
import { getPlan } from "@/lib/stripe";
import { nanoid } from "nanoid";
import { getExpiryDate, formatBytes } from "@/lib/utils";
import { sendTransferEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { z } from "zod";

const FileMetaSchema = z.object({
  name: z.string().min(1),
  size: z.number().positive(),
  type: z.string(),
  iv: z.string(),
});

const UploadRequestSchema = z.object({
  files: z.array(FileMetaSchema).min(1),
  expiry: z.string().default("24h"),
  password: z.string().optional(),
  emails: z.string().optional(),
  title: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.user?.id;

    let userPlan = "free";
    if (userId) {
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
      });
      userPlan = dbUser?.plan || "free";
    }
    const plan = getPlan(userPlan);

    const body = await req.json();
    const parsed = UploadRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { files, expiry, password, emails, title, message } = parsed.data;

    // Check file size limits
    let totalSize = 0;
    for (const file of files) {
      if (file.size > plan.maxFileSize) {
        return NextResponse.json(
          {
            error: `File "${file.name}" exceeds the ${formatBytes(plan.maxFileSize)} limit for your plan`,
          },
          { status: 400 }
        );
      }
      totalSize += file.size;
    }

    // Check daily transfer limit
    if (userId && plan.maxTransfersPerDay !== Infinity) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const transfersToday = await prisma.transfer.count({
        where: { userId, createdAt: { gte: todayStart } },
      });
      if (transfersToday >= plan.maxTransfersPerDay) {
        return NextResponse.json(
          { error: "Daily transfer limit reached for your plan" },
          { status: 429 }
        );
      }
    }

    const recipients = emails
      ? emails.split(",").map((e) => e.trim()).filter(Boolean)
      : [];

    if (recipients.length > 0 && !plan.emailDelivery) {
      return NextResponse.json(
        { error: "Email delivery is not available on your plan" },
        { status: 403 }
      );
    }

    if (recipients.length > plan.maxRecipients) {
      return NextResponse.json(
        { error: `Your plan allows a maximum of ${plan.maxRecipients} recipients` },
        { status: 400 }
      );
    }

    if (password && !plan.passwordProtection) {
      return NextResponse.json(
        { error: "Password protection is available on the Pro plan" },
        { status: 403 }
      );
    }

    const transferId = nanoid(10);
    const hashedPassword = password ? await bcrypt.hash(password, 12) : null;
    const expiresAt = getExpiryDate(expiry);

    // Generate presigned upload URLs — browser uploads directly to MinIO
    const fileRecords: {
      name: string;
      size: bigint;
      type: string;
      s3Key: string;
      iv: string;
    }[] = [];

    const presignedUrls: { index: number; url: string; key: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = nanoid(10);
      const s3Key = `transfers/${transferId}/${fileId}/${file.name}`;

      const url = await getPresignedUploadUrl(s3Key);

      presignedUrls.push({ index: i, url, key: s3Key });
      fileRecords.push({
        name: file.name,
        size: BigInt(file.size),
        type: file.type || "application/octet-stream",
        s3Key,
        iv: file.iv,
      });
    }

    // Create transfer record immediately — files upload directly from browser
    await prisma.transfer.create({
      data: {
        id: transferId,
        userId: userId || null,
        title: title || null,
        message: message || null,
        password: hashedPassword,
        expiresAt,
        recipientEmails: recipients,
        totalSize: BigInt(totalSize),
        fileCount: files.length,
        files: { create: fileRecords },
      },
    });

    // Send emails after upload completes (best-effort)
    if (recipients.length > 0) {
      const transferUrl = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/transfer/${transferId}`;
      const senderName = session?.user?.name || "Someone";

      Promise.all(
        recipients.map((to) =>
          sendTransferEmail({
            to,
            senderName,
            transferUrl,
            message: message || undefined,
            fileCount: files.length,
            totalSize: formatBytes(totalSize),
          })
        )
      )
        .then(() =>
          prisma.transfer.update({
            where: { id: transferId },
            data: { emailSent: true },
          })
        )
        .catch((err) => console.error("Failed to send transfer emails:", err));
    }

    return NextResponse.json({ transferId, presignedUrls }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "An error occurred during upload" },
      { status: 500 }
    );
  }
}
