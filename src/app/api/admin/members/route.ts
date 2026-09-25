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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type"); // "cxo" or "partner"

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (type === "partner") {
      db.deletePartnerMember(id);
    } else {
      db.deleteCxoMember(id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
