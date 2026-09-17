import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  try {
    const cxoMembers = db.getCxoMembers();
    const partnerMembers = db.getPartnerMembers();
    return NextResponse.json({ cxoMembers, partnerMembers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, type, status } = body;

    if (!id || !type || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let success = false;
    if (type === "cxo") {
      success = db.updateCxoStatus(id, status);
    } else if (type === "partner") {
      success = db.updatePartnerStatus(id, status);
    }

    if (!success) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update member status" }, { status: 500 });
  }
}
