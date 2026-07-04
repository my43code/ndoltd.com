import { connectMongoDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidateSite } from "@/lib/revalidateSite";

export async function PUT(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    if (!id) {
      return NextResponse.json({ message: "Missing project id" }, { status: 400 });
    }

    await connectMongoDB();
    const updatedProject = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    revalidateSite();

    return NextResponse.json({ message: "Project updated", project: updatedProject }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error);
    return NextResponse.json({ message: "Failed to update project" }, { status: 500 });
  }
}
