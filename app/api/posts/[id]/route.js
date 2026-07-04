/*import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import slugify from "slugify";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidateSite } from "@/lib/revalidateSite";

export async function PUT(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const { title, summary, content, image } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Missing post id" },
        { status: 400 }
      );
    }

    if (!title || !summary || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // ✅ Generate new slug from title
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
    });

    // ✅ Prevent duplicate slug, but exclude current post
    let uniqueSlug = baseSlug;
    let count = 1;

    while (
      await Post.findOne({
        slug: uniqueSlug,
        _id: { $ne: id },
      })
    ) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    // ✅ Update post including slug
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        content,
        image,
        slug: uniqueSlug,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    revalidateSite();

    return NextResponse.json(
      { message: "Post updated", post: updatedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/posts/[id] error:", error);

    return NextResponse.json(
      {
        message: "Failed to update post",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Missing post id" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    revalidateSite();

    return NextResponse.json(
      { message: "Post deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete post",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
*/

import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidateSite } from "@/lib/revalidateSite";

export async function PUT(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const { title, summary, content, image } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Missing post id" }, { status: 400 });
    }

    if (!title || !summary || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
    });

    let uniqueSlug = baseSlug;
    let count = 1;

    while (
      await Post.findOne({
        slug: uniqueSlug,
        _id: { $ne: id },
      })
    ) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, summary, content, image, slug: uniqueSlug },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    revalidateSite();

    return NextResponse.json({ message: "Post updated", post: updatedPost }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/posts/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update post", error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    await connectMongoDB();
    await Post.findByIdAndDelete(id);
    revalidateSite();
    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete post" },
      { status: 500 }
    );
  }
}
