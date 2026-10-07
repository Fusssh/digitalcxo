import { NextResponse } from "next/server";
import { db } from "@/lib/store";

const BACKEND_API_BASE = (
  process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://backenddigi-236970479379.asia-south1.run.app/api/v1"
).replace(/\/+$/, "");

// 25 submissions per 15 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_SUBMISSIONS = 25;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "::1";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_SUBMISSIONS) {
    return true;
  }
  entry.count += 1;
  return false;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Rate limiting check
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many submissions from this IP, please try again later."
        },
        { status: 429 }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "First name, email, and message are required fields"
        },
        { status: 400 }
      );
    }

    // Honeypot check
    if (body.honeypot && String(body.honeypot).trim() !== "") {
      return NextResponse.json({
        success: true,
        message: "Thank you for contacting us. Your message has been received.",
        data: {
          id: `hp-${Date.now()}`,
          createdAt: new Date().toISOString()
        }
      });
    }

    // Resolve aliases
    let firstName = (
      body.firstName ||
      body.first_name ||
      body.name ||
      body.fullName ||
      body.full_name ||
      ""
    ).toString().trim();

    let lastName = (body.lastName || body.last_name || "").toString().trim();

    // If firstName is compound ("John Doe") and lastName is not separately provided, split
    if (firstName && !lastName && firstName.includes(" ")) {
      const parts = firstName.split(/\s+/);
      firstName = parts[0];
      lastName = parts.slice(1).join(" ");
    }

    const title = (body.title || body.salutation || "Mr.").toString().trim();
    const email = (body.email || "").toString().trim();
    const phone = (body.phone || body.phoneNumber || body.mobile || "").toString().trim();
    const subject = (body.subject || "Website Inquiry").toString().trim();
    const message = (body.message || "").toString().trim();

    // 1. Required fields: firstName, email, message
    if (!firstName || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "First name, email, and message are required fields"
        },
        { status: 400 }
      );
    }

    // 2. Email format validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address"
        },
        { status: 400 }
      );
    }

    // 3. Message character limit (max 1000 characters)
    if (message.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation Error",
          errors: ["Message cannot exceed 1000 characters"]
        },
        { status: 400 }
      );
    }

    const normalizedPayload = {
      title,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      subject,
      message
    };

    // Forward to remote backend if available
    try {
      const backendRes = await fetch(`${BACKEND_API_BASE}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": ip
        },
        body: JSON.stringify(normalizedPayload)
      });

      const backendData = await backendRes.json().catch(() => null);
      if (backendData) {
        return NextResponse.json(backendData, { status: backendRes.status });
      }
    } catch (backendError) {
      console.warn("Remote backend /contact call failed, falling back to local store:", backendError);
    }

    // Fallback: save to local store
    const newContact = db.addContact({
      title,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      subject,
      message,
      ipAddress: ip,
      status: "NEW",
      emailStatus: "SENT"
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for contacting us. Your message has been received.",
        data: {
          id: newContact._id || newContact.id,
          createdAt: newContact.createdAt || newContact.submittedAt
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Internal Server Error in /api/v1/contact:", error);
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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
