import { NextResponse } from "next/server";
import { db } from "@/lib/store";

const BACKEND_API_BASE = (
  process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://backenddigi-236970479379.asia-south1.run.app/api/v1"
).replace(/\/+$/, "");

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    // Attempt forward to remote backend if authorization token is available
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const backendRes = await fetch(`${BACKEND_API_BASE}/admin/contacts`, {
          method: "GET",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json"
          }
        });
        const backendData = await backendRes.json().catch(() => null);
        if (backendData && backendData.data) {
          const mapped = backendData.data.map((c: any) => ({
            id: c._id || c.id,
            _id: c._id || c.id,
            name: `${c.firstName || ""} ${c.lastName || ""}`.trim() || c.name || "Anonymous",
            title: c.title || "Mr.",
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email,
            phone: c.phone || "",
            subject: c.subject || "Website Inquiry",
            message: c.message,
            status: c.status || "NEW",
            adminNotes: c.adminNotes || "",
            emailStatus: c.emailStatus || "SENT",
            emailError: c.emailError || null,
            submittedAt: c.createdAt || new Date().toISOString(),
            createdAt: c.createdAt,
            updatedAt: c.updatedAt
          }));
          return NextResponse.json({
            contacts: mapped,
            success: true,
            data: mapped,
            pagination: backendData.pagination
          });
        }
      } catch (backendErr) {
        console.warn("Backend forward in /api/admin/contacts GET failed:", backendErr);
      }
    }

    const contacts = db.getContacts().map((c) => ({
      ...c,
      id: c.id || c._id,
      _id: c._id || c.id,
      name: c.name || `${c.firstName || ""} ${c.lastName || ""}`.trim()
    }));

    return NextResponse.json({
      contacts,
      success: true,
      data: contacts
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contact inquiries" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        await fetch(`${BACKEND_API_BASE}/admin/contacts/${id}/status`, {
          method: "PATCH",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status, adminNotes })
        });
      } catch (backendErr) {
        console.warn("Backend forward in /api/admin/contacts PATCH failed:", backendErr);
      }
    }

    const ok = db.updateContactStatus(id, status, adminNotes);
    if (!ok) {
      return NextResponse.json({ error: "Contact inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, contact: ok });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update contact inquiry" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");
    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        await fetch(`${BACKEND_API_BASE}/admin/contacts/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json"
          }
        });
      } catch (backendErr) {
        console.warn("Backend forward in /api/admin/contacts DELETE failed:", backendErr);
      }
    }

    db.deleteContact(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete contact inquiry" }, { status: 500 });
  }
}
