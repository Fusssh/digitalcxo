import { NextResponse } from "next/server";
import { db } from "@/lib/store";

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
    const { title, subtitle, youtubeUrl, guests, overview } = body;

    if (!title || !youtubeUrl) {
      return NextResponse.json(
        { error: "Title and YouTube URL are required" },
        { status: 400 }
      );
    }

    // Extract YouTube ID
    let youtubeId = "";
    const match = youtubeUrl.match(/(?:v=|\/embed\/|\/watch\?v=|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) {
      youtubeId = match[1];
    }

    const newPodcast = db.addPodcast({
      title,
      subtitle: subtitle || "Digital CXOS Thought Leadership",
      youtubeUrl,
      youtubeId,
      thumbnailUrl: youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : undefined,
      guests: guests || [],
      overview: overview || ""
    });

    return NextResponse.json({ success: true, podcast: newPodcast });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add podcast" }, { status: 500 });
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
