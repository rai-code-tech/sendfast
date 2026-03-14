import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/s3";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: {
        files: {
          select: {
            id: true,
            name: true,
            size: true,
            type: true,
            createdAt: true,
          },
        },
        _count: {
          select: { downloads: true },
        },
      },
    });

    if (!transfer) {
      return NextResponse.json(
        { error: "Transfer not found" },
        { status: 404 }
      );
    }

    if (transfer.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: transfer.id,
      title: transfer.title,
      message: transfer.message,
      expiresAt: transfer.expiresAt,
      totalSize: Number(transfer.totalSize),
      fileCount: transfer.fileCount,
      downloadCount: transfer._count.downloads,
      passwordProtected: !!transfer.password,
      recipientEmails: transfer.recipientEmails,
      emailSent: transfer.emailSent,
      createdAt: transfer.createdAt,
      files: transfer.files.map((file) => ({
        ...file,
        size: Number(file.size),
      })),
    });
  } catch (error) {
    console.error("Get transfer error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the transfer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: {
        files: {
          select: { s3Key: true },
        },
      },
    });

    if (!transfer) {
      return NextResponse.json(
        { error: "Transfer not found" },
        { status: 404 }
      );
    }

    if (transfer.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    // Delete files from S3
    await Promise.all(
      transfer.files.map((file) => deleteFile(file.s3Key))
    );

    // Delete transfer (cascades to files and downloads)
    await prisma.transfer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete transfer error:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the transfer" },
      { status: 500 }
    );
  }
}
