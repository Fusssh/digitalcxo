import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name, role, justification } = body;

    if (action === "signup") {
      if (!email || !name || !password) {
        return NextResponse.json(
          { error: "Name, email, and password are required" },
          { status: 400 }
        );
      }

      const assignedRole = role || "Content Director";
      const newUser = {
        id: `admin-${Date.now()}`,
        name,
        email,
        role: assignedRole,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=070D1F,1E1E1E&textColor=C9A227`,
        token: `mock-jwt-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        justification: justification || ""
      };

      return NextResponse.json({
        success: true,
        message: "Admin access granted / created successfully",
        user: newUser
      });
    }

    // Default: Sign In
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Demo / default credentials check
    const demoUser = {
      id: "admin-super-01",
      name: email.split("@")[0].toUpperCase() === "ADMIN" ? "Executive Administrator" : email.split("@")[0],
      email: email,
      role: email.includes("lead") ? "Community Lead" : (email.includes("editor") ? "Content Director" : "Super Admin"),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}&backgroundColor=070D1F,1E1E1E&textColor=C9A227`,
      token: `mock-jwt-session-${Date.now()}`
    };

    return NextResponse.json({
      success: true,
      user: demoUser
    });
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
