import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  try {
    const teamMembers = db.getTeamMembers();
    return NextResponse.json({ success: true, teamMembers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leadership team" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, slug, bio, sectors, linkedin, image, experience, quote, featured } = body;

    if (!name || !role) {
      return NextResponse.json(
        { error: "Name and Role are required fields" },
        { status: 400 }
      );
    }

    const newLeader = db.addTeamMember({
      name,
      role,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      bio: bio || "",
      sectors: Array.isArray(sectors) ? sectors : (typeof sectors === "string" ? sectors.split(",").map(s => s.trim()).filter(Boolean) : []),
      linkedin: linkedin || "",
      image: image || "/assests/rohit-1.webp",
      experience: experience || "",
      quote: quote || "",
      featured: Boolean(featured)
    });

    return NextResponse.json({ success: true, member: newLeader });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add leadership member" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (updates.sectors && typeof updates.sectors === "string") {
      updates.sectors = updates.sectors.split(",").map((s: string) => s.trim()).filter(Boolean);
    }

    const updated = db.updateTeamMember(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Leader not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update leadership member" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    db.deleteTeamMember(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete leadership member" }, { status: 500 });
  }
}
