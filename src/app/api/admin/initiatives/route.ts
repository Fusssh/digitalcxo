import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  try {
    const initiatives = db.getInitiatives();
    return NextResponse.json({ success: true, initiatives });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch initiatives" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, iconName } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and Description are required" },
        { status: 400 }
      );
    }

    const newInitiative = db.addInitiative({
      title,
      description,
      category: category || "Mentorship",
      iconName: iconName || "Sparkles"
    });

    return NextResponse.json({ success: true, initiative: newInitiative });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create initiative" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updated = db.updateInitiative(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Initiative not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, initiative: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update initiative" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    db.deleteInitiative(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete initiative" }, { status: 500 });
  }
}
