import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  try {
    const events = db.getEvents();
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, date, venue, tagline, type, videoType, videoUrl, description } = body;

    if (!title || !date || !tagline) {
      return NextResponse.json(
        { error: "Title, Date, and Tagline are required" },
        { status: 400 }
      );
    }

    const newEvent = db.addEvent({
      title,
      date,
      venue: venue || "",
      tagline,
      type: type || "upcoming",
      videoType: videoType || (videoUrl?.includes(".mp4") ? "mp4" : "youtube"),
      videoUrl: videoUrl || "",
      description: description || ""
    });

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add event" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    db.deleteEvent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
