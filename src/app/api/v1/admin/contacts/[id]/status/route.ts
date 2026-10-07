import { NextResponse } from "next/server";
import { db } from "@/lib/store";

const BACKEND_API_BASE = (
  process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://backenddigi-236970479379.asia-south1.run.app/api/v1"
).replace(/\/+$/, "");

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;
const ALLOWED_STATUSES = ["NEW", "READ", "IN_PROGRESS", "RESOLVED", "SPAM"];

function isValidId(id: string): boolean {
  return OBJECT_ID_REGEX.test(id);
}

// 4. PATCH /api/v1/admin/contacts/:id/status - Update contact status and admin notes
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID format
    if (!isValidId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid ID parameter: ${id}`
        },
        { status: 400 }
      );
    }

    // Auth check
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authorized, no token provided"
        },
        { status: 401 }
      );
    }
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authorized, no token provided"
        },
        { status: 401 }
      );
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Empty or invalid body is acceptable if fields are optional
    }

    const { status, adminNotes } = body;

    // Validate status if provided
    if (status !== undefined && status !== null && status !== "") {
      const normalizedStatus = String(status).toUpperCase();
      if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid status. Allowed: NEW, READ, IN_PROGRESS, RESOLVED, SPAM"
          },
          { status: 400 }
        );
      }
    }

    // Forward to remote backend
    try {
      const backendRes = await fetch(`${BACKEND_API_BASE}/admin/contacts/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...(status ? { status: String(status).toUpperCase() } : {}),
          ...(adminNotes !== undefined ? { adminNotes } : {})
        })
      });

      const backendData = await backendRes.json().catch(() => null);
      if (backendData) {
        return NextResponse.json(backendData, { status: backendRes.status });
      }
    } catch (backendError) {
      console.warn(`Backend PATCH /admin/contacts/${id}/status forward failed, falling back:`, backendError);
    }

    // Fallback to local store
    const contact = db.getContactById(id);
    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message: "Contact not found"
        },
        { status: 404 }
      );
    }

    const updated = db.updateContactStatus(
      id,
      status ? String(status).toUpperCase() : undefined,
      adminNotes
    );

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          message: "Contact not found"
        },
        { status: 404 }
      );
    }

    const formatted = {
      _id: updated._id || updated.id,
      title: updated.title || "Mr.",
      firstName: updated.firstName || (updated.name ? updated.name.split(" ")[0] : "Rahul"),
      lastName: updated.lastName || (updated.name ? updated.name.split(" ").slice(1).join(" ") : "Sharma"),
      email: updated.email,
      phone: updated.phone || "",
      subject: updated.subject || "Website Inquiry",
      message: updated.message,
      status: updated.status || "RESOLVED",
      adminNotes: updated.adminNotes || "",
      emailStatus: updated.emailStatus || "SENT",
      emailError: updated.emailError || null,
      ipAddress: updated.ipAddress || "::1",
      createdAt: updated.createdAt || updated.submittedAt || new Date().toISOString(),
      updatedAt: updated.updatedAt || new Date().toISOString(),
      __v: updated.__v ?? 0
    };

    return NextResponse.json({
      success: true,
      message: "Contact status updated successfully",
      data: formatted
    });
  } catch (error) {
    console.error("Internal Server Error in PATCH /api/v1/admin/contacts/:id/status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error"
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
