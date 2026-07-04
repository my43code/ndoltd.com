import { connectMongoDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidateSite } from "@/lib/revalidateSite";

export async function GET() {
  try {
    await connectMongoDB();
    const services = await Service.find().sort({ createdAt: -1 });
    return NextResponse.json(services);
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    await connectMongoDB();
    const service = await Service.create(body);
    revalidateSite();
    return NextResponse.json(
      { message: "Service created", service },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/services error:", error);
    return NextResponse.json(
      { message: "Failed to create service" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await request.json();
    await connectMongoDB();
    await Service.findByIdAndDelete(id);
    revalidateSite();
    return NextResponse.json({ message: "Service deleted" });
  } catch (error) {
    console.error("DELETE /api/services error:", error);
    return NextResponse.json(
      { message: "Failed to delete service" },
      { status: 500 }
    );
  }
}
