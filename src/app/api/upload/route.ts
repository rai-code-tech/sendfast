import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/s3";
import { getPlan } from "@/lib/stripe";
import { nanoid } from "nanoid";
import { getExpiryDate, formatBytes } from "@/lib/utils";
import { sendTransferEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.user?.id;

    // Look up user plan from DB if authenticated
    let userPlan = "free";
    if (userId) {
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
      });
      userPlan = dbUser?.plan || "free";
    }
    const plan = getPlan(userPlan);

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const ivs = formData.getAll("ivs") as string[];
    const originalSizes = formData.getAll("sizes") as string[];
    const originalTypes = formData.getAll("types") as string[];
    const title = formData.get("title") as string | null;
    const message = formData.get("message") as string | null;
    const password = formData.get("password") as string | null;
    const expiry = (formData.get("expiry") as string) || "24h";
    const recipientsRaw = formData.get("recipients") as string | null;
    const emailsRaw = formData.get("emails") as string | null;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Check file size limits
    let totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      const fileSize = originalSizes[i] ? parseInt(originalSizes[i]) : files[i].size;
      if (fileSize > plan.maxFileSize) {
        return NextResponse.json(
          {
            error: `File "${files[i].name}" exceeds the maximum size of ${formatBytes(plan.maxFileSize)} for your plan`,
          },
          { status: 400 }
        );
      }
      totalSize += fileSize;
    }

    // Check daily transfer limit
    if (userId && plan.maxTransfersPerDay !== Infinity) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const transfersToday = await prisma.transfer.count({
        where: {
          userId,
          createdAt: { gte: todayStart },
        },
      });

      if (transfersToday >= plan.maxTransfersPerDay) {
        return NextResponse.json(
          { error: "Daily transfer limit reached for your plan" },
          { status: 429 }
        );
      }
    }

    // Check recipients
    const recipientSource = recipientsRaw || emailsRaw;
    const recipients = recipientSource
      ? recipientSource.split(",").map((e) => e.trim()).filter(Boolean)
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

    // Upload files to S3
    const fileRecords: {
      name: string;
      size: bigint;
      type: string;
      s3Key: string;
      iv: string;
    }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = nanoid(10);
      const s3Key = `transfers/${transferId}/${fileId}/${file.name}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const iv = ivs[i] || "";
      const originalType = originalTypes[i] || file.type || "application/octet-stream";
      const originalSize = originalSizes[i] ? BigInt(originalSizes[i]) : BigInt(file.size);

      await uploadFile(s3Key, buffer, "application/octet-stream");

      fileRecords.push({
        name: file.name,
        size: originalSize,
        type: originalType,
        s3Key,
        iv,
      });
    }

    // Create transfer in DB
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
        files: {
          create: fileRecords,
        },
      },
    });

    // Send emails to recipients
    if (recipients.length > 0) {
      const transferUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/transfer/${transferId}`;
      const senderName = session?.user?.name || "Someone";

      const emailPromises = recipients.map((to) =>
        sendTransferEmail({
          to,
          senderName,
          transferUrl,
          message: message || undefined,
          fileCount: files.length,
          totalSize: formatBytes(totalSize),
        })
      );

      try {
        await Promise.all(emailPromises);
        await prisma.transfer.update({
          where: { id: transferId },
          data: { emailSent: true },
        });
      } catch (emailError) {
        console.error("Failed to send transfer emails:", emailError);
      }
    }

    return NextResponse.json({ transferId }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "An error occurred during upload" },
      { status: 500 }
    );
  }
}
