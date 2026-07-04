/*import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import slugify from "slugify";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidateSite } from "@/lib/revalidateSite";

// ✅ GET POSTS
export async function GET() {
  try {
    await connectMongoDB();
    const posts = await Post.find().sort({ createdAt: -1 });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);

    return NextResponse.json(
      { message: "Failed to fetch posts", posts: [] },
      { status: 500 }
    );
  }
}

// ✅ CREATE POST
export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { title, summary, content, image } = await request.json();

    if (!title || !summary || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // ✅ Generate slug
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
    });

    // ✅ Ensure unique slug
    let uniqueSlug = baseSlug;
    let count = 1;

    while (await Post.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    const newPost = await Post.create({
      title,
      summary,
      content,
      image,
      slug: uniqueSlug,
    });

    revalidateSite();

    return NextResponse.json(
      { message: "Post created successfully", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);

    return NextResponse.json(
      {
        message: "Failed to create post",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}



/*import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import slugify from "slugify";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidateSite } from "@/lib/revalidateSite";

export async function GET() {
  try {
    await connectMongoDB();
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("GET /api/posts error:", error);

    return NextResponse.json(
      { message: "Failed to fetch posts", posts: [] },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { title, summary, content, image } = await request.json();

    if (!title || !summary || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // ✅ Generate slug
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
    });

    // ✅ Ensure unique slug
    let uniqueSlug = baseSlug;
    let count = 1;

    while (await Post.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    // ✅ Create post
    const newPost = await Post.create({
      title,
      summary,
      content,
      image,
      slug: uniqueSlug,
    });

    revalidateSite();

    return NextResponse.json(
      { message: "Post created successfully", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);

    return NextResponse.json(
      {
        message: "Failed to create post",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}*/


/*
import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import slugify from "slugify";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidateSite } from "@/lib/revalidateSite"; 

export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { title, summary, content, image } = await request.json();

    if (!title || !summary || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // ✅ AUTO FIX OLD POSTS (IMPORTANT)
    const posts = await Post.find();

    for (const post of posts) {
      if (!post.slug) {
        const fixedSlug = slugify(post.title, {
          lower: true,
          strict: true,
        });

        post.slug = fixedSlug;
        await post.save();
      }
    }

    // ✅ GENERATE NEW SLUG
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
    });

    let uniqueSlug = baseSlug;
    let count = 1;

    while (await Post.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    // ✅ CREATE POST
    const newPost = await Post.create({
      title,
      summary,
      content,
      image,
      slug: uniqueSlug,
    });

    revalidateSite();

    return NextResponse.json(
      { message: "Post created successfully", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);

    return NextResponse.json(
      {
        message: "Failed to create post",
        error: error?.message || "Unknown",
      },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { title, summary, content, image } = await request.json();

    if (!title || !summary || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // ✅ AUTO FIX OLD POSTS (IMPORTANT)
    const posts = await Post.find();

    for (const post of posts) {
      if (!post.slug) {
        const fixedSlug = slugify(post.title, {
          lower: true,
          strict: true,
        });

        post.slug = fixedSlug;
        await post.save();
      }
    }

    // ✅ GENERATE NEW SLUG
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
    });

    let uniqueSlug = baseSlug;
    let count = 1;

    while (await Post.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    // ✅ CREATE POST
    const newPost = await Post.create({
      title,
      summary,
      content,
      image,
      slug: uniqueSlug,
    });

    revalidateSite();

    return NextResponse.json(
      { message: "Post created successfully", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);

    return NextResponse.json(
      {
        message: "Failed to create post",
        error: error?.message || "Unknown",
      },
      { status: 500 }
    );
  }
}
*/

/*export async function GET() {
  try {
    await connectMongoDB();
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { message: "Failed to fetch posts", posts: []  },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { title, summary, content, image } = await request.json();

    // ✅ VALIDATION
    if (!title || !summary || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // ✅ STEP 1: GENERATE SLUG
    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    // ✅ STEP 2: PREVENT DUPLICATE SLUGS (IMPORTANT)
    let uniqueSlug = slug;
    let count = 1;

    while (await Post.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    // ✅ STEP 3: CREATE POST WITH SLUG
    const newPost = await Post.create({
      title,
      summary,
      content,
      image,
      slug: uniqueSlug, // ✅ IMPORTANT
    });

    revalidateSite();

    return NextResponse.json(
      { message: "Post created successfully", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      {
        message: "Failed to create post",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}*/

import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import slugify from "slugify";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidateSite } from "@/lib/revalidateSite";

export async function GET() {
  try {
    await connectMongoDB();
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { message: "Failed to fetch posts", posts: [] },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { title, summary, content, image } = await request.json();

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

    while (await Post.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    const newPost = await Post.create({
      title,
      summary,
      content,
      image,
      slug: uniqueSlug,
    });

    revalidateSite();

    return NextResponse.json(
      { message: "Post created successfully", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { message: "Failed to create post", error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
} 
