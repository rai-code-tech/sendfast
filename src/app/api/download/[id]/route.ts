import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getPresignedDownloadUrl } from "@/lib/s3";
import { isExpired } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: {
        files: true,
        _count: { select: { downloads: true } },
      },
    });

    if (!transfer) {
      return NextResponse.json(
        { error: "Transfer not found" },
        { status: 404 }
      );
    }

    // Check expiry
    if (isExpired(transfer.expiresAt)) {
      return NextResponse.json(
        { error: "This transfer has expired" },
        { status: 410 }
      );
    }

    // Check max downloads
    if (
      transfer.maxDownloads !== null &&
      transfer._count.downloads >= transfer.maxDownloads
    ) {
      return NextResponse.json(
        { error: "Download limit reached for this transfer" },
        { status: 410 }
      );
    }

    // File metadata (without URLs) for password-protected transfers
    const filesMeta = transfer.files.map((file) => ({
      id: file.id,
      name: file.name,
      size: Number(file.size),
      type: file.type,
      iv: file.iv,
    }));

    // Check password
    if (transfer.password) {
      const password = req.nextUrl.searchParams.get("password");

      if (!password) {
        return NextResponse.json({
          id: transfer.id,
          title: transfer.title,
          message: transfer.message,
          expiresAt: transfer.expiresAt,
          createdAt: transfer.createdAt,
          downloadCount: transfer._count.downloads,
          passwordProtected: true,
          needsPassword: true,
          files: filesMeta,
        });
      }

      const isValid = await bcrypt.compare(password, transfer.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid password", passwordProtected: true },
          { status: 401 }
        );
      }
    }

    // Record download
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await prisma.download.create({
      data: {
        transferId: id,
        ip,
        userAgent,
      },
    });

    // Generate presigned URLs for all files
    const files = await Promise.all(
      transfer.files.map(async (file) => ({
        id: file.id,
        name: file.name,
        size: Number(file.size),
        type: file.type,
        iv: file.iv,
        url: await getPresignedDownloadUrl(file.s3Key, file.name),
      }))
    );

    return NextResponse.json({
      id: transfer.id,
      title: transfer.title,
      message: transfer.message,
      expiresAt: transfer.expiresAt,
      createdAt: transfer.createdAt,
      downloadCount: transfer._count.downloads,
      passwordProtected: !!transfer.password,
      files,
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the transfer" },
      { status: 500 }
    );
  }
}
