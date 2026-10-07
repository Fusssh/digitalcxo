import { NextResponse } from "next/server";
import { db } from "@/lib/store";

const BACKEND_API_BASE = (
  process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://backenddigi-236970479379.asia-south1.run.app/api/v1"
).replace(/\/+$/, "");

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

function isValidId(id: string): boolean {
  return OBJECT_ID_REGEX.test(id);
}

// 3. GET /api/v1/admin/contacts/:id - Opens one message, logs CONTACT_VIEWED
export async function GET(
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

    // Forward to remote backend
    try {
      const backendRes = await fetch(`${BACKEND_API_BASE}/admin/contacts/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const backendData = await backendRes.json().catch(() => null);
      if (backendData) {
        return NextResponse.json(backendData, { status: backendRes.status });
      }
    } catch (backendError) {
      console.warn(`Backend /admin/contacts/${id} forward failed, falling back:`, backendError);
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

    // Write CONTACT_VIEWED audit log
    db.logAudit("CONTACT_VIEWED", {
      contactId: id,
      viewedAt: new Date().toISOString()
    });

    const formatted = {
      _id: contact._id || contact.id,
      title: contact.title || "Mr.",
      firstName: contact.firstName || (contact.name ? contact.name.split(" ")[0] : "Rahul"),
      lastName: contact.lastName || (contact.name ? contact.name.split(" ").slice(1).join(" ") : "Sharma"),
      email: contact.email,
      phone: contact.phone || "",
      subject: contact.subject || "Website Inquiry",
      message: contact.message,
      status: contact.status || "NEW",
      adminNotes: contact.adminNotes || "",
      emailStatus: contact.emailStatus || "SENT",
      emailError: contact.emailError || null,
      ipAddress: contact.ipAddress || "::1",
      createdAt: contact.createdAt || contact.submittedAt || new Date().toISOString(),
      updatedAt: contact.updatedAt || contact.submittedAt || new Date().toISOString(),
      __v: contact.__v ?? 0
    };

    return NextResponse.json({
      success: true,
      message: "Contact details retrieved",
      data: formatted
    });
  } catch (error) {
    console.error("Internal Server Error in GET /api/v1/admin/contacts/:id:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error"
      },
      { status: 500 }
    );
  }
}

// 5. DELETE /api/v1/admin/contacts/:id - Permanently deletes, logs CONTACT_DELETED
export async function DELETE(
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

    // Forward to remote backend
    try {
      const backendRes = await fetch(`${BACKEND_API_BASE}/admin/contacts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const backendData = await backendRes.json().catch(() => null);
      if (backendData) {
        return NextResponse.json(backendData, { status: backendRes.status });
      }
    } catch (backendError) {
      console.warn(`Backend DELETE /admin/contacts/${id} forward failed, falling back:`, backendError);
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

    db.deleteContact(id);

    // Write CONTACT_DELETED audit log
    db.logAudit("CONTACT_DELETED", {
      contactId: id,
      deletedAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: "Contact deleted successfully",
      data: null
    });
  } catch (error) {
    console.error("Internal Server Error in DELETE /api/v1/admin/contacts/:id:", error);
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
      "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
