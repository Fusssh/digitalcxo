import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  try {
    const eventHighlights = db.getEventHighlights();
    return NextResponse.json({ success: true, eventHighlights });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch event highlights" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, videoUrl, posterUrl, tag, edition, duration } = body;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: "Title and Video URL (MP4) are required" },
        { status: 400 }
      );
    }

    const newHighlight = db.addEventHighlight({
      title,
      videoUrl,
      posterUrl: posterUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
      tag: tag || "Flagship Conclave",
      edition: edition || "Annual Summit",
      duration: duration || "03:30"
    });

    return NextResponse.json({ success: true, eventHighlight: newHighlight });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create event highlight" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updated = db.updateEventHighlight(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Event highlight not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, eventHighlight: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update event highlight" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    db.deleteEventHighlight(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete event highlight" }, { status: 500 });
  }
}
