import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { canGenerateReport } from "@/lib/usage";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usage = await canGenerateReport(userId);
    return NextResponse.json(usage);
  } catch (error) {
    console.error("Usage check error:", error);
    return NextResponse.json({ error: "Failed to check usage" }, { status: 500 });
  }
}
