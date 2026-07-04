
import { connectMongoDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidateSite } from "@/lib/revalidateSite";

export async function GET() {
	try {
		await connectMongoDB();
		const projects = await Project.find().sort({ createdAt: -1 });
		return NextResponse.json(projects);
	} catch (error) {
		console.error("GET /api/projects error:", error);
		return NextResponse.json({ message: "Failed to fetch projects" }, { status: 500 });
	}
}

export async function POST(request) {
	const authError = await requireAdmin(request);
	if (authError) return authError;

	try {
		const body = await request.json();
		await connectMongoDB();
		const project = await Project.create(body);
		revalidateSite();
		return NextResponse.json({ message: "Project created", project }, { status: 201 });
	} catch (error) {
		console.error("POST /api/projects error:", error);
		return NextResponse.json({ message: "Failed to create project" }, { status: 500 });
	}
}

export async function DELETE(request) {
	const authError = await requireAdmin(request);
	if (authError) return authError;

	try {
		const { id } = await request.json();
		if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
		await connectMongoDB();
		await Project.findByIdAndDelete(id);
		revalidateSite();
		return NextResponse.json({ message: "Project deleted" });
	} catch (error) {
		console.error("DELETE /api/projects error:", error);
		return NextResponse.json({ message: "Failed to delete project" }, { status: 500 });
	}
}
