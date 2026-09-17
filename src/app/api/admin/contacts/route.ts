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
