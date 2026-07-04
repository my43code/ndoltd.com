import { connectMongoDB } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await connectMongoDB();
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json(
      { message: "Failed to load messages", messages: [] },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    await ContactMessage.create({ name, email, subject, message });

    return NextResponse.json(
      { message: "Message saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { message: "Failed to save message" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: "Missing message id" }, { status: 400 });
    }

    await connectMongoDB();
    const deletedMessage = await ContactMessage.findByIdAndDelete(id);

    if (!deletedMessage) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/contact error:", error);
    return NextResponse.json({ message: "Failed to delete message" }, { status: 500 });
  }
}
