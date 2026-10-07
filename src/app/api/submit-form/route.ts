import { NextResponse } from "next/server";
import { db } from "@/lib/store";
import { cxoMembershipSchema } from "@/lib/schemas/cxoSchema";
import { partnerMembershipSchema } from "@/lib/schemas/partnerSchema";
import { contactSchema } from "@/lib/schemas/contactSchema";

const BACKEND_API_BASE = (
  process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://backenddigi-236970479379.asia-south1.run.app/api/v1"
).replace(/\/+$/, "");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    // 1. PUBLIC CXO MEMBERSHIP SUBMISSION (Step 1 API)
    if (type === "cxo") {
      const validation = cxoMembershipSchema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json(
          { error: "Validation failed", details: validation.error.format() },
          { status: 400 }
        );
      }

      const v = validation.data;
      const payload = {
        applicationType: "CXO",
        title: v.title || "Mr.",
        firstName: v.firstName,
        middleName: v.middleName || undefined,
        lastName: v.lastName,
        email: v.officialEmail,
        mobile: v.mobile,
        phone: v.mobile,
        organization: v.organization,
        company: v.organization,
        designation: v.designation,
        country: v.country || "India",
        state: v.state,
        city: v.city,
        linkedin: v.linkedin || "NA",
        organizationWebsite: v.organizationWebsite || undefined,
        boardInteractionExperience: v.boardExperience ? "Yes" : "No",
        leadershipExperienceYears: parseInt(String((v as any).leadershipExperience || "0")) || 0,
        contributeVia: (v as any).contributeVia ? [(v as any).contributeVia] : ["General Executive Participation & Networking"],
        strategicAreasOfInterest: (v as any).strategicInterests ? [(v as any).strategicInterests] : ["Enterprise Digital Transformation"],
        industry: (v as any).industry ? [(v as any).industry] : ["Information Technology & ITES"],
        preferredModeOfEngagement: "Online",
        howDidYouHear: "Direct Outreach",
        otherCxoNetworks: "No",
        termsAccepted: true,
        informationConfirmed: true
      };

      try {
        const backendRes = await fetch(`${BACKEND_API_BASE}/join-us`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const backendData = await backendRes.json().catch(() => ({}));

        if (!backendRes.ok) {
          if (backendRes.status === 409) {
            return NextResponse.json(
              { error: "We have already received your application. Our team will contact you soon." },
              { status: 409 }
            );
          }
          if (backendData.message || (Array.isArray(backendData.errors) && backendData.errors.length > 0)) {
            const msg = Array.isArray(backendData.errors) ? backendData.errors.join(", ") : backendData.message;
            return NextResponse.json({ error: msg }, { status: backendRes.status });
          }
        }
      } catch (e) {
        console.warn("Backend /api/v1/join-us call error, fallback to local store:", e);
      }

      const newMember = db.addCxoMember(v);
      return NextResponse.json({
        success: true,
        message: "CXO Membership application submitted successfully",
        memberId: newMember.id
      });
    }

    // 2. PUBLIC PARTNER MEMBERSHIP SUBMISSION (Step 2 API)
    if (type === "partner") {
      const validation = partnerMembershipSchema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json(
          { error: "Validation failed", details: validation.error.format() },
          { status: 400 }
        );
      }

      const v = validation.data;
      const payload = {
        applicationType: "PARTNER",
        companyName: v.organization,
        company: v.organization,
        title: v.title || "Mr.",
        firstName: v.firstName,
        lastName: v.lastName,
        email: v.email,
        mobile: v.mobile,
        phone: v.mobile,
        hqLocation: `${v.city}, ${v.state}`,
        presenceInIndia: v.presenceInIndia || "Pan India",
        designation: v.designation,
        preferredModesOfEngagement: (v.preferredEngagementTypes && v.preferredEngagementTypes.length > 0)
          ? v.preferredEngagementTypes.join(", ")
          : "Thought Leadership & Summits",
        ethicalConductAccepted: true,
        termsAccepted: true
      };

      try {
        const backendRes = await fetch(`${BACKEND_API_BASE}/join-us`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const backendData = await backendRes.json().catch(() => ({}));

        if (!backendRes.ok) {
          if (backendRes.status === 409) {
            return NextResponse.json(
              { error: "We have already received your application. Our team will contact you soon." },
              { status: 409 }
            );
          }
          if (backendData.message || (Array.isArray(backendData.errors) && backendData.errors.length > 0)) {
            const msg = Array.isArray(backendData.errors) ? backendData.errors.join(", ") : backendData.message;
            return NextResponse.json({ error: msg }, { status: backendRes.status });
          }
        }
      } catch (e) {
        console.warn("Backend /api/v1/join-us partner call error, fallback to local store:", e);
      }

      const newPartner = db.addPartnerMember(v);
      return NextResponse.json({
        success: true,
        message: "Partner membership inquiry submitted successfully",
        partnerId: newPartner.id
      });
    }

    // 3. CONTACT INQUIRY SUBMISSION
    if (type === "contact") {
      if (data.honeypot && data.honeypot.trim() !== "") {
        return NextResponse.json({ success: true, message: "Inquiry received." });
      }

      const validation = contactSchema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json(
          { error: "Validation failed", details: validation.error.format() },
          { status: 400 }
        );
      }

      const v = validation.data;
      const payload = {
        title: v.title || "Mr.",
        firstName: v.firstName,
        lastName: v.lastName || "",
        name: `${v.firstName} ${v.lastName || ""}`.trim(),
        email: v.email,
        phone: v.phone || "",
        subject: v.subject || "Website Inquiry",
        message: v.message
      };

      try {
        const backendRes = await fetch(`${BACKEND_API_BASE}/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const backendData = await backendRes.json().catch(() => ({}));
        if (backendRes.ok && backendData.data) {
          return NextResponse.json({
            success: true,
            message: "Contact inquiry submitted successfully",
            inquiryId: backendData.data.id || backendData.data._id
          });
        }
      } catch (e) {
        console.warn("Backend /contact call error in submit-form, falling back to local store:", e);
      }

      const newContact = db.addContact({
        title: v.title,
        firstName: v.firstName,
        lastName: v.lastName,
        name: `${v.firstName} ${v.lastName || ""}`.trim(),
        email: v.email,
        phone: v.phone,
        subject: v.subject,
        message: v.message
      });

      return NextResponse.json({
        success: true,
        message: "Contact inquiry submitted successfully",
        inquiryId: newContact.id || newContact._id
      });
    }

    return NextResponse.json({ error: "Invalid submission type" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Internal server error processing form submission" },
      { status: 500 }
    );
  }
}
