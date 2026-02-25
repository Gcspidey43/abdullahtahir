import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Prepare form data for Web3Forms
    const formData = new URLSearchParams();
    formData.append("access_key", "e4e2e7f0-bf8a-4d78-9348-cf2a01332f32");
    formData.append("name", name);
    formData.append("email", email);
    formData.append("subject", `Portfolio Contact: ${subject}`);
    formData.append("message", `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`);

    // Send to Web3Forms
    const web3formsResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body: formData.toString(),
    });

    // Get response as text first
    const responseText = await web3formsResponse.text();
    
    // Try to parse as JSON
    let web3formsData;
    try {
      web3formsData = JSON.parse(responseText);
    } catch {
      console.error("Web3Forms returned non-JSON response:", responseText.substring(0, 500));
      return NextResponse.json(
        { error: "Service unavailable. Please try WhatsApp instead." },
        { status: 500 }
      );
    }

    if (web3formsResponse.ok && web3formsData.success) {
      console.log("========================================");
      console.log("CONTACT FORM SUBMITTED SUCCESSFULLY");
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Subject:", subject);
      console.log("========================================");

      return NextResponse.json(
        {
          success: true,
          message: "Message sent! I'll get back to you within 24 hours. 🙌",
        },
        { status: 200 }
      );
    } else {
      console.error("Web3Forms error:", web3formsData);
      return NextResponse.json(
        { error: web3formsData.message || "Something went wrong. Please try WhatsApp instead." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try WhatsApp instead." },
      { status: 500 }
    );
  }
}
