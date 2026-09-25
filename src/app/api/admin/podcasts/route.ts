import { NextResponse } from "next/server";
import { db } from "@/lib/store";
import { extractYouTubeId } from "@/lib/utils";

export async function GET() {
  try {
    const podcasts = db.getPodcasts();
    return NextResponse.json({ podcasts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch podcasts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, youtubeUrl, guests, overview, duration, date } = body;

    if (!title || !youtubeUrl) {
      return NextResponse.json(
        { error: "Title and YouTube URL are required" },
        { status: 400 }
      );
    }

    const youtubeId = extractYouTubeId(youtubeUrl);

    const newPodcast = db.addPodcast({
      title,
      subtitle: subtitle || "Digital CXOS Thought Leadership",
      youtubeUrl,
      youtubeId: youtubeId || "dQw4w9WgXcQ",
      thumbnailUrl: youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : undefined,
      duration: duration || "45 mins",
      date: date || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      guests: guests || [],
      overview: overview || ""
    });

    return NextResponse.json({ success: true, podcast: newPodcast });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add podcast" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, youtubeUrl, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (youtubeUrl) {
      const youtubeId = extractYouTubeId(youtubeUrl);
      updates.youtubeUrl = youtubeUrl;
      updates.youtubeId = youtubeId;
      if (youtubeId) {
        updates.thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
      }
    }

    const updated = db.updatePodcast(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, podcast: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update podcast" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    db.deletePodcast(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete podcast" }, { status: 500 });
  }
}
