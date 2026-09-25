import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  try {
    const socialInitiatives = db.getSocialInitiatives();
    return NextResponse.json({ success: true, socialInitiatives });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch social initiatives" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tag, title, description, image, link, date } = body;

    if (!title || !description || !image) {
      return NextResponse.json(
        { error: "Title, description, and image URL are required" },
        { status: 400 }
      );
    }

    const newSocial = db.addSocialInitiative({
      tag: tag || "Social Impact",
      title,
      description,
      image,
      link: link || "/initiatives",
      date: date || "Ongoing Initiative"
    });

    return NextResponse.json({ success: true, socialInitiative: newSocial });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create social initiative" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updated = db.updateSocialInitiative(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Social initiative not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, socialInitiative: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update social initiative" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    db.deleteSocialInitiative(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete social initiative" }, { status: 500 });
  }
}
