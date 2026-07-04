"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import LoadingState from "@/components/LoadingState";

function matchesQuery(item, query) {
  const lowerQuery = (query || "").toString().toLowerCase().trim();
  if (!lowerQuery) return false;

  const values = [];
  Object.values(item).forEach((value) => {
    if (typeof value === "string") {
      values.push(value.toLowerCase());
    } else if (Array.isArray(value)) {
      values.push(value.join(" ").toLowerCase());
    } else if (typeof value === "object" && value !== null) {
      values.push(JSON.stringify(value).toLowerCase());
    }
  });

  const haystack = values.join(" ");
  if (haystack.includes(lowerQuery)) {
    return true;
  }

  const tokens = lowerQuery.split(/\s+/).filter(Boolean);
  return tokens.some((token) => haystack.includes(token));
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, projectsRes, postsRes, aboutRes] = await Promise.all([
          fetch("/api/services", { cache: "no-store" }),
          fetch("/api/projects", { cache: "no-store" }),
          fetch("/api/posts", { cache: "no-store" }),
          fetch("/api/about", { cache: "no-store" }),
        ]);

        const servicesData = servicesRes.ok ? await servicesRes.json() : [];
        const projectsData = projectsRes.ok ? await projectsRes.json() : [];
        const postsData = postsRes.ok ? await postsRes.json() : { posts: [] };
        const aboutData = aboutRes.ok ? await aboutRes.json() : null;

        setServices(servicesData);
        setProjects(projectsData);
        setPosts(postsData.posts || []);
        setAbout(aboutData);
      } catch (error) {
        console.error("Search data loading failed:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSearch = () => {
    setSearchTerm(query.trim());
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter((item) =>
      matchesQuery({
        title: item.title,
        description: item.description,
        shortDescription: item.shortDescription,
        link: item.link,
        video: item.video,
      }, searchTerm)
    );
  }, [services, searchTerm]);

  const filteredProjects = useMemo(() => {
    return projects.filter((item) =>
      matchesQuery({
        title: item.title,
        description: item.description,
        shortDescription: item.shortDescription,
        link: item.link,
        video: item.video,
      }, searchTerm)
    );
  }, [projects, searchTerm]);

  const filteredPosts = useMemo(() => {
    return posts.filter((item) =>
      matchesQuery({
        title: item.title,
        summary: item.summary,
        content: item.content,
      }, searchTerm)
    );
  }, [posts, searchTerm]);

  const aboutMatches = useMemo(() => {
    if (!about) return false;
    return matchesQuery(
      {
        history: about.history?.text,
        mission: about.mission,
        vision: about.vision,
        values: about.values,
        team: about.team?.map((member) => `${member.name} ${member.role}`),
        projects: about.projects?.map((project) => `${project.title} ${project.description}`),
      },
      searchTerm
    );
  }, [about, searchTerm]);

  return (
    <section className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Search</h1>
            <p className="text-slate-600 mt-2">
              Search across services, projects, posts, and about content.
            </p>
          </div>

          <Link
            href="/"
            className="text-emerald-600 font-medium hover:underline"
          >
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-10 flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center gap-3 flex-1 w-full">
            <Search className="text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search for any word or phrase..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full outline-none text-slate-800"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Search
          </button>
        </div>
        {!loading ? (
          searchTerm && filteredServices.length === 0 && filteredProjects.length === 0 && filteredPosts.length === 0 && !aboutMatches ? (
            <p className="text-slate-500 mb-6">No matches found for &quot;{searchTerm}&quot;.</p>
          ) : searchTerm ? (
            <p className="text-slate-500 mb-6">Search results for &quot;{searchTerm}&quot;</p>
          ) : (
            <p className="text-slate-500 mb-6">Enter a word or phrase and click Search.</p>
          )
        ) : null}

        {loading ? (
          <LoadingState
            eyebrow="Search"
            title="Loading search data"
            subtitle="We are pulling services, projects, posts, and about content from MongoDB."
          />
        ) : (
          <>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-slate-900">Services</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <div
                      key={service._id}
                      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
                    >
                      <h3 className="text-lg font-semibold">{service.title}</h3>
                      <p className="text-slate-600 mt-2 text-sm">
                        {service.description || service.shortDescription}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No matching services found.</p>
                )}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-slate-900">Projects</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <div
                      key={project._id}
                      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4"
                    >
                      <Image
                        src={project.image || "/images/project1.webp"}
                        width={400}
                        height={250}
                        alt={project.title || "Project"}
                        className="rounded-xl w-full h-[220px] object-cover"
                      />
                      <h3 className="mt-4 text-lg font-semibold">{project.title}</h3>
                      <p className="text-slate-600 mt-2 text-sm">
                        {project.description || project.shortDescription}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No matching projects found.</p>
                )}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-slate-900">Posts</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
                    >
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="text-slate-600 mt-2 text-sm">
                        {post.summary}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No matching posts found.</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-slate-900">About</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                {aboutMatches ? (
                  <div>
                    <p className="text-slate-600">
                      Your search matches content from the About page.
                    </p>
                    <p className="text-slate-500 mt-2">
                      Try searching company mission, team names, project titles, or values.
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-500">No matching About content found.</p>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </section>
  );
}
