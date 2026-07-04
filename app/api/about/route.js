import { connectMongoDB } from "@/lib/mongodb";
import About from "@/models/About";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { createDefaultAbout, normalizeAboutContent } from "@/lib/siteDefaults";
import { revalidateSite } from "@/lib/revalidateSite";
import { clearSiteAboutCache } from "@/lib/siteContent";

export async function GET() {
  try {
    await connectMongoDB();
    const about = await About.findOne().sort({ createdAt: -1 });

    if (!about) {
      const created = await About.create(createDefaultAbout());
      return NextResponse.json(normalizeAboutContent(created.toObject()));
    }

    return NextResponse.json(normalizeAboutContent(about.toObject()));
  } catch (error) {
    console.error("GET /api/about error:", error);
    return NextResponse.json(createDefaultAbout(), { status: 500 });
  }
}

export async function PUT(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    await connectMongoDB();

    const existingAbout = await About.findOne().sort({ createdAt: -1 });
    const payload = normalizeAboutContent({
      ...(existingAbout ? existingAbout.toObject() : createDefaultAbout()),
      ...body,
    });

    let about;
    if (existingAbout) {
      about = await About.findByIdAndUpdate(existingAbout._id, payload, {
        new: true,
      });
    } else {
      about = await About.create(payload);
    }

    clearSiteAboutCache();
    revalidateSite();

    return NextResponse.json({
      message: "About updated",
      about: normalizeAboutContent(about.toObject()),
    });
  } catch (error) {
    console.error("PUT /api/about error:", error);
    return NextResponse.json(
      { message: "Failed to update about" },
      { status: 500 }
    );
  }
}
