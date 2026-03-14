import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const transfers = await prisma.transfer.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            files: true,
            downloads: true,
          },
        },
      },
    });

    const result = transfers.map((transfer) => ({
      id: transfer.id,
      title: transfer.title,
      message: transfer.message,
      expiresAt: transfer.expiresAt,
      totalSize: Number(transfer.totalSize),
      fileCount: transfer._count.files,
      downloadCount: transfer._count.downloads,
      passwordProtected: !!transfer.password,
      recipientEmails: transfer.recipientEmails,
      emailSent: transfer.emailSent,
      createdAt: transfer.createdAt,
    }));

    return NextResponse.json({ transfers: result });
  } catch (error) {
    console.error("List transfers error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching transfers" },
      { status: 500 }
    );
  }
}
