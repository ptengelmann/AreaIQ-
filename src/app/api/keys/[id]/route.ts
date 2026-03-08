import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { revokeApiKey } from "@/lib/api-keys";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const revoked = await revokeApiKey(userId, id);

  if (!revoked) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
