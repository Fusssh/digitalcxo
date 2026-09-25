import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  try {
    const partnerApplications = db.getPartnerMembers();
    const partnersCatalog = db.getPartners();
    return NextResponse.json({ 
      success: true, 
      partnerApplications,
      partnersCatalog
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, tier, logoUrl, websiteUrl, status, description } = body;

    if (!name || !logoUrl) {
      return NextResponse.json(
        { error: "Partner Name and Logo URL are required" },
        { status: 400 }
      );
    }

    const newPartner = db.addPartner({
      name,
      tier: tier || "Strategic Partner",
      logoUrl,
      websiteUrl: websiteUrl || "#",
      status: status || "Active",
      description: description || ""
    });

    return NextResponse.json({ success: true, partner: newPartner });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create partner entry" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, type, status, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // If updating an application status
    if (type === "application") {
      const ok = db.updatePartnerStatus(id, status);
      return NextResponse.json({ success: ok });
    }

    // Updating partner catalog item
    const updated = db.updatePartner(id, { status, ...updates });
    if (!updated) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, partner: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type"); // "application" or "catalog"

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (type === "application") {
      db.deletePartnerMember(id);
    } else {
      db.deletePartner(id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 });
  }
}
