import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  try {
    const contacts = db.getContacts();
    return NextResponse.json({ contacts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contact inquiries" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const ok = db.updateContactStatus(id, status);
    if (!ok) {
      return NextResponse.json({ error: "Contact inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update contact inquiry" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    db.deleteContact(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete contact inquiry" }, { status: 500 });
  }
}
