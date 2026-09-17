import { NextResponse } from "next/server";
import { db } from "@/lib/store";
import { cxoMembershipSchema } from "@/lib/schemas/cxoSchema";
import { partnerMembershipSchema } from "@/lib/schemas/partnerSchema";
import { contactSchema } from "@/lib/schemas/contactSchema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === "cxo") {
      const validation = cxoMembershipSchema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json(
          { error: "Validation failed", details: validation.error.format() },
          { status: 400 }
        );
      }

      const newMember = db.addCxoMember(validation.data);
      return NextResponse.json({
        success: true,
        message: "CXO Membership application submitted successfully",
        memberId: newMember.id
      });
    }

    if (type === "partner") {
      const validation = partnerMembershipSchema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json(
          { error: "Validation failed", details: validation.error.format() },
          { status: 400 }
        );
      }

      const newPartner = db.addPartnerMember(validation.data);
      return NextResponse.json({
        success: true,
        message: "Partner membership inquiry submitted successfully",
        partnerId: newPartner.id
      });
    }

    if (type === "contact") {
      // Check honeypot
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

      const newContact = db.addContact({
        title: validation.data.title,
        name: validation.data.name,
        email: validation.data.email,
        phone: validation.data.phone,
        message: validation.data.message
      });

      return NextResponse.json({
        success: true,
        message: "Contact inquiry submitted successfully",
        inquiryId: newContact.id
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
