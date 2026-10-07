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

    const { searchParams } = new URL(request.url);
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "10", 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const limit = isNaN(limitParam) || limitParam < 1 ? 10 : Math.min(limitParam, 100);
    const status = searchParams.get("status") || "";
    const search = (searchParams.get("search") || "").toLowerCase().trim();

    // 1. Forward to live backend
    try {
      const backendUrl = new URL(`${BACKEND_API_BASE}/admin/contacts`);
      searchParams.forEach((val, key) => backendUrl.searchParams.set(key, val));

      const backendRes = await fetch(backendUrl.toString(), {
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
      console.warn("Backend /admin/contacts forward failed, falling back to local store:", backendError);
    }

    // 2. Fallback to local store
    const allContacts = db.getContacts();
    let filtered = allContacts;

    if (status) {
      filtered = filtered.filter(
        (c) => (c.status || "").toUpperCase() === status.toUpperCase()
      );
    }

    if (search) {
      filtered = filtered.filter((c) => {
        const titleMatch = (c.title || "").toLowerCase().includes(search);
        const nameMatch = (c.name || `${c.firstName || ""} ${c.lastName || ""}`).toLowerCase().includes(search);
        const emailMatch = (c.email || "").toLowerCase().includes(search);
        const phoneMatch = (c.phone || "").toLowerCase().includes(search);
        const subjectMatch = (c.subject || "").toLowerCase().includes(search);
        const messageMatch = (c.message || "").toLowerCase().includes(search);
        return titleMatch || nameMatch || emailMatch || phoneMatch || subjectMatch || messageMatch;
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit).map((c) => ({
      _id: c._id || c.id,
      title: c.title || "Mr.",
      firstName: c.firstName || (c.name ? c.name.split(" ")[0] : "Rahul"),
      lastName: c.lastName || (c.name ? c.name.split(" ").slice(1).join(" ") : "Sharma"),
      email: c.email,
      phone: c.phone || "",
      subject: c.subject || "Website Inquiry",
      message: c.message,
      status: c.status || "NEW",
      adminNotes: c.adminNotes || "",
      emailStatus: c.emailStatus || "SENT",
      emailError: c.emailError || null,
      ipAddress: c.ipAddress || "::1",
      createdAt: c.createdAt || c.submittedAt || new Date().toISOString(),
      updatedAt: c.updatedAt || c.submittedAt || new Date().toISOString(),
      __v: c.__v ?? 0
    }));

    return NextResponse.json({
      success: true,
      message: "Contacts retrieved successfully",
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error("Internal Server Error in /api/v1/admin/contacts:", error);
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
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
