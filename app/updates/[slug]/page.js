import { notFound } from "next/navigation";
import Link from "next/link";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import Image from "next/image";

export const revalidate = 60;

async function getPost(slug) {
  try {
    await connectMongoDB();

    let post = await Post.findOne({ slug }).lean();

    if (!post && mongoose.isValidObjectId(slug)) {
      post = await Post.findById(slug).lean();
    }

    return post;
  } catch (error) {
    if (process.env.npm_lifecycle_event !== "build") {
      console.error("Failed to load post:", error);
    }
    return null;
  }
}

export default async function PostDetailPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white/80 px-4 py-4 sm:px-6 backdrop-blur">
        <div className="mx-auto max-w-5xl">
          <a
            href="/updates"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline"
          >
            Back to Updates
          </a>
        </div>
      </div>

      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
            Company update
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            {post.title || "Update"}
          </h1>
          <p className="mt-4 text-base text-slate-600 md:text-lg">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {post.image ? (
          <div className="group relative mb-12 h-[260px] overflow-hidden rounded-[2rem] border border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:h-[480px] transition-transform duration-700 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] image-shadow">
            <Image
              src={post.image}
              alt={post.title || "Post image"}
              fill
              className="dynamic-image object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority
            />
          </div>
        ) : null}

        {post.summary ? (
          <div className="mb-12 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 px-6 py-5">
            <p className="text-lg italic leading-relaxed text-slate-700 md:text-xl">
              {post.summary}
            </p>
          </div>
        ) : null}

        <div className="prose prose-slate max-w-none">
          {post.content ? (
            <div className="whitespace-pre-wrap break-words text-lg leading-8 text-slate-800">
              {post.content}
            </div>
          ) : null}
        </div>
      </article>
    </main>
  );
}
