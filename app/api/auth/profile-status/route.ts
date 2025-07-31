import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserProfileAction } from "@/app/(dashboard)/actions/profile-actions";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profileResult = await getUserProfileAction();

    if (!profileResult.success) {
      return NextResponse.json(
        { error: "Failed to get profile status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      hasCompletedProfile: profileResult.data?.hasCompletedProfile || false,
    });
  } catch (error) {
    console.error("Profile status check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
