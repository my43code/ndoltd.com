"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import LoadingState from "@/components/LoadingState";


const emptyService = {
  title: "",
  description: "",
  shortDescription: "",
  image: "/images/project1.webp",
  video: "",
  link: "",
};

const emptyProject = {
  title: "",
  description: "",
  shortDescription: "",
  image: "/images/project1.webp",
  video: "",
  link: "",
};

const emptyPost = {
  title: "",
  summary: "",
  content: "",
  image: "/images/project1.webp",
};

const emptyAbout = {
  history: { text: "", image: "", video: "" },
  mission: "",
  vision: "",
  values: [""],
  mvv: { image: "", video: "" },
  team: [],
  projects: [],
};

const emptyTeamMember = {
  name: "",
  role: "",
  image: "",
  email: "",
  phone: "",
  linkedin: "",
};

function FormField({ label, value, onChange, type = "text", textarea = false }) {
  const className =
    "w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:text-base";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {textarea ? (
        <textarea
          className={`${className} min-h-[110px] resize-y`}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className={className}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function FileField({ label, accept, onFileSelect, description, capture }) {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [sizeWarning, setSizeWarning] = useState("");

  const isVideo = accept && accept.includes("video");
  const maxVideoSizeInMB = 10;
  const maxImageSizeInMB = 5;
  const maxSize = isVideo ? maxVideoSizeInMB : maxImageSizeInMB;

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeInMB = file.size / (1024 * 1024);
    setFileName(file.name);
    setFileSize(fileSizeInMB);

    if (fileSizeInMB > maxSize) {
      setSizeWarning(
        `This ${isVideo ? "video" : "image"} is ${fileSizeInMB.toFixed(1)}MB. For best mobile performance, keep it under ${maxSize}MB.`
      );
      return;
    } else {
      setSizeWarning("");
    }

    const dataUrl = await readFileAsDataUrl(file);
    onFileSelect(dataUrl);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <label className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-slate-700 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50/50 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">
            Choose {isVideo ? "video" : "image"} from your device
          </p>
          <p className="text-xs text-slate-500 sm:text-sm">
            {description || "Pick a file or use your camera from the device picker."}
          </p>
        </div>
        <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
          Browse
        </span>
        <input
          type="file"
          accept={accept}
          capture={capture}
          onChange={handleFileSelect}
          className="sr-only"
          aria-label={label}
        />
      </label>
      {fileName ? (
        <p className="text-xs text-slate-500 sm:text-sm">
          Selected file: {fileName} ({fileSize.toFixed(1)}MB)
        </p>
      ) : null}
      {sizeWarning ? (
        <p className="text-xs font-medium text-amber-600 sm:text-sm">{sizeWarning}</p>
      ) : null}
      {!fileName && description ? (
        <p className="text-xs text-slate-500 sm:text-sm">{description}</p>
      ) : null}
      {isVideo && (
        <p className="text-xs text-slate-500 sm:text-sm">
          Tip: For smoother playback, keep videos short and under {maxVideoSizeInMB}MB when possible.
        </p>
      )}
    </div>
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

async function fetchDashboardData() {
  const [servicesRes, projectsRes, postsRes, aboutRes, messagesRes] = await Promise.all([
    fetch("/api/services", { cache: "no-store", credentials: "include" }),
    fetch("/api/projects", { cache: "no-store", credentials: "include" }),
    fetch("/api/posts", { cache: "no-store", credentials: "include" }),
    fetch("/api/about", { cache: "no-store", credentials: "include" }),
    fetch("/api/contact", { cache: "no-store", credentials: "include" }),
  ]);

  const services = servicesRes.ok ? await servicesRes.json() : [];
  const projects = projectsRes.ok ? await projectsRes.json() : [];
  const postsData = postsRes.ok ? await postsRes.json() : { posts: [] };
  const about = aboutRes.ok ? await aboutRes.json() : emptyAbout;
  const messagesData = messagesRes.ok ? await messagesRes.json() : { messages: [] };

  return {
    services,
    projects,
    posts: postsData.posts || [],
    messages: messagesData.messages || [],
    about,
  };
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState("services");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [about, setAbout] = useState(emptyAbout);

  const [serviceForm, setServiceForm] = useState(emptyService);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [postForm, setPostForm] = useState(emptyPost);
  const [teamMemberForm, setTeamMemberForm] = useState(emptyTeamMember);
  const [editingTeamMemberIndex, setEditingTeamMemberIndex] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);

  function applyDashboardData({ services, projects, posts, messages, about }) {
    setServices(services);
    setProjects(projects);
    setPosts(posts);
    setMessages(messages);
    setAbout(about);
  }

  async function loadData() {
    setLoading(true);
    try {
      const data = await fetchDashboardData();
      applyDashboardData(data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setStatus("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const data = await fetchDashboardData();
        if (cancelled) return;
        applyDashboardData(data);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load dashboard data:", error);
          setStatus("Failed to load dashboard data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  async function createService(e) {
    e.preventDefault();
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceForm),
      credentials: "include",
    });
    if (res.ok) {
      setServiceForm(emptyService);
      setStatus("Service created.");
      await loadData();
    } else {
      setStatus("Failed to create service.");
    }
  }

  async function deleteService(id) {
    const res = await fetch("/api/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      credentials: "include",
    });
    if (res.ok) {
      setStatus("Service deleted.");
      setEditingServiceId(null);
      setServiceForm(emptyService);
      await loadData();
    }
  }

  function editService(item) {
    setEditingServiceId(item._id);
    setServiceForm({
      title: item.title || "",
      shortDescription: item.shortDescription || "",
      description: item.description || "",
      image: item.image || "",
      video: item.video || "",
      link: item.link || "",
    });
    setStatus("");
  }

  function cancelServiceEdit() {
    setEditingServiceId(null);
    setServiceForm(emptyService);
  }

  async function updateService(e) {
    e.preventDefault();
    if (!editingServiceId) return;

    const res = await fetch(`/api/services/${editingServiceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceForm),
      credentials: "include",
    });

    if (res.ok) {
      setStatus("Service updated.");
      setEditingServiceId(null);
      setServiceForm(emptyService);
      await loadData();
    } else {
      const errorData = await res.json();
      setStatus(errorData.message || "Failed to update service.");
    }
  }

  async function createProject(e) {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectForm),
      credentials: "include",
    });
    if (res.ok) {
      setProjectForm(emptyProject);
      setStatus("Project created.");
      await loadData();
    } else {
      setStatus("Failed to create project.");
    }
  }

  async function deleteProject(id) {
    const res = await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      credentials: "include",
    });
    if (res.ok) {
      setStatus("Project deleted.");
      setEditingProjectId(null);
      setProjectForm(emptyProject);
      await loadData();
    }
  }

  function editProject(item) {
    setEditingProjectId(item._id);
    setProjectForm({
      title: item.title || "",
      shortDescription: item.shortDescription || "",
      description: item.description || "",
      image: item.image || "",
      video: item.video || "",
      link: item.link || "",
    });
    setStatus("");
  }

  function cancelProjectEdit() {
    setEditingProjectId(null);
    setProjectForm(emptyProject);
  }

  async function updateProject(e) {
    e.preventDefault();
    if (!editingProjectId) return;

    const res = await fetch(`/api/projects/${editingProjectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectForm),
      credentials: "include",
    });

    if (res.ok) {
      setStatus("Project updated.");
      setEditingProjectId(null);
      setProjectForm(emptyProject);
      await loadData();
    } else {
      const errorData = await res.json();
      setStatus(errorData.message || "Failed to update project.");
    }
  }
/*async function createPost(e) {
  e.preventDefault();

  setStatus("⏳ Creating post...");

  try {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postForm),
      credentials: "include",
    });

    const data = await res.json();

    console.log("API RESPONSE:", data);

    if (res.ok) {
      setPostForm(emptyPost);
      setStatus("✅ Post created successfully");
      await loadData();
    } else {
      setStatus(`❌ ${data.message || data.error || "Failed to create post"}`);
    }
  } catch (error) {
    console.error("REQUEST ERROR:", error);
    setStatus("❌ Network error. Check console.");
  }
}*/
  /*async function createPost(e) {
    e.preventDefault();
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postForm),
      credentials: "include",
    });
    if (res.ok) {
      setPostForm(emptyPost);
      setStatus("Post created.");
      await loadData();
    } else {
      const errorData = await res.json();
      setStatus(errorData.message || "Failed to create post.");
    }
  }*/

    async function createPost(e) {
  e.preventDefault();

  try {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postForm),
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      setPostForm(emptyPost);
      setStatus("Post created.");
      await loadData();
    } else {
      setStatus(data.message || data.error || "Failed to create post.");
      console.error("ERROR:", data);
    }
  } catch (error) {
    console.error("REQUEST ERROR:", error);
    setStatus("Request failed.");
  }
}

  async function deletePost(id) {
    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setStatus("Post deleted.");
      setEditingPostId(null);
      setPostForm(emptyPost);
      await loadData();
    }
  }

  async function deleteMessage(id) {
    const res = await fetch("/api/contact", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      credentials: "include",
    });

    if (res.ok) {
      setStatus("Message deleted.");
      await loadData();
    } else {
      const errorData = await res.json();
      setStatus(errorData.message || "Failed to delete message.");
    }
  }

  function editPost(item) {
    setEditingPostId(item._id);
    setPostForm({
      title: item.title || "",
      summary: item.summary || "",
      content: item.content || "",
      image: item.image || "",
    });
    setStatus("");
  }

  function cancelPostEdit() {
    setEditingPostId(null);
    setPostForm(emptyPost);
  }

  async function updatePost(e) {
    e.preventDefault();
    if (!editingPostId) return;

    const res = await fetch(`/api/posts/${editingPostId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postForm),
      credentials: "include",
    });

    if (res.ok) {
      setStatus("Post updated.");
      setEditingPostId(null);
      setPostForm(emptyPost);
      await loadData();
    } else {
      const errorData = await res.json();
      setStatus(errorData.message || "Failed to update post.");
    }
  }

  async function saveAboutContent(nextAbout, successMessage = "About page updated.") {
    const payload = {
      ...nextAbout,
      values: (nextAbout.values || []).filter((v) => v && v.trim() !== ""),
      team: (nextAbout.team || [])
        .map((member) => ({
          ...member,
          name: member.name?.trim() || "",
          role: member.role?.trim() || "",
          image: member.image?.trim() || "",
          video: member.video?.trim() || "",
          email: member.email?.trim() || "",
          phone: member.phone?.trim() || "",
          linkedin: member.linkedin?.trim() || "",
        }))
        .filter((member) => member.name || member.role || member.image || member.email || member.phone || member.linkedin || member.video),
    };

    const res = await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      setAbout(data.about || payload);
      setStatus(successMessage);
      await loadData();
      return true;
    }

    setStatus("Failed to update about page.");
    return false;
  }

  async function saveAbout(e) {
    e.preventDefault();
    await saveAboutContent(about);
  }

  async function saveTeamMember(e) {
    e.preventDefault();

    const nextTeamMember = {
      name: teamMemberForm.name.trim(),
      role: teamMemberForm.role.trim(),
      image: teamMemberForm.image.trim(),
      email: teamMemberForm.email.trim(),
      phone: teamMemberForm.phone.trim(),
      linkedin: teamMemberForm.linkedin.trim(),
    };

    if (!nextTeamMember.name || !nextTeamMember.role) {
      setStatus("Please enter a name and position title for the team member.");
      return;
    }

    const updatedTeam = editingTeamMemberIndex === null
      ? [...(about.team || []), nextTeamMember]
      : (about.team || []).map((member, index) =>
          index === editingTeamMemberIndex ? nextTeamMember : member
        );

    const nextAbout = {
      ...about,
      team: updatedTeam,
    };

    const saved = await saveAboutContent(
      nextAbout,
      editingTeamMemberIndex === null ? "Team member added." : "Team member updated."
    );

    if (saved) {
      setTeamMemberForm(emptyTeamMember);
      setEditingTeamMemberIndex(null);
    }
  }

  function editTeamMember(member, index) {
    setEditingTeamMemberIndex(index);
    setTeamMemberForm({
      name: member.name || "",
      role: member.role || "",
      image: member.image || "",
      email: member.email || "",
      phone: member.phone || "",
      linkedin: member.linkedin || "",
    });
    setStatus("");
  }

  async function deleteTeamMember(index) {
    const updatedTeam = (about.team || []).filter((_, memberIndex) => memberIndex !== index);
    const nextAbout = {
      ...about,
      team: updatedTeam,
    };

    await saveAboutContent(nextAbout, "Team member removed.");
  }

  const tabs = [
    { id: "services", label: "Services" },
    { id: "projects", label: "Projects" },
    { id: "posts", label: "Posts" },
    { id: "messages", label: "Messages" },
    { id: "about", label: "About" },
  ];

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            Manage services, projects, posts, and about content.
          </p>
          {session?.user?.email ? (
            <p className="mt-2 text-sm text-slate-500">
              Signed in as {session.user.email}
            </p>
          ) : null}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto sm:text-base"
        >
          Sign out
        </button>
      </div>

      {status && (
        <p className="mb-4 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
          {status}
        </p>
      )}

      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`min-w-[7rem] flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold sm:flex-none ${
              tab === t.id
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState
          eyebrow="Admin dashboard"
          title="Loading your dashboard"
          subtitle="We are fetching live services, projects, posts, and about content."
        />
      ) : (
        <>
          {tab === "services" && (
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
              <form
                onSubmit={editingServiceId ? updateService : createService}
                className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
              >
                <h2 className="text-xl font-semibold">
                  {editingServiceId ? "Edit Service" : "Add Service"}
                </h2>
                <FormField
                  label="Title"
                  value={serviceForm.title}
                  onChange={(v) => setServiceForm({ ...serviceForm, title: v })}
                />
                <FormField
                  label="Short Description"
                  value={serviceForm.shortDescription}
                  onChange={(v) =>
                    setServiceForm({ ...serviceForm, shortDescription: v })
                  }
                  textarea
                />
                <FormField
                  label="Description"
                  value={serviceForm.description}
                  onChange={(v) =>
                    setServiceForm({ ...serviceForm, description: v })
                  }
                  textarea
                />
                <FormField
                  label="Image URL"
                  value={serviceForm.image}
                  onChange={(v) => setServiceForm({ ...serviceForm, image: v })}
                />
                <FileField
                  label="Upload Image"
                  accept="image/*"
                  capture="environment"
                  onFileSelect={(dataUrl) =>
                    setServiceForm({ ...serviceForm, image: dataUrl })
                  }
                  description="Tap Browse to select an image from your device or camera."
                />
                <FormField
                  label="Video URL"
                  value={serviceForm.video}
                  onChange={(v) => setServiceForm({ ...serviceForm, video: v })}
                />
                <FileField
                  label="Upload Video"
                  accept="video/*"
                  capture="environment"
                  onFileSelect={(dataUrl) =>
                    setServiceForm({ ...serviceForm, video: dataUrl })
                  }
                  description="Tap Browse to select a video from your device or camera."
                />
                <FormField
                  label="Link"
                  value={serviceForm.link}
                  onChange={(v) => setServiceForm({ ...serviceForm, link: v })}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
                  >
                    {editingServiceId ? "Update Service" : "Create Service"}
                  </button>
                  {editingServiceId ? (
                    <button
                      type="button"
                      onClick={cancelServiceEdit}
                      className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Existing Services</h2>
                {services.length === 0 ? (
                  <p className="text-slate-500">No services yet.</p>
                ) : (
                  services.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-start gap-4"
                    >
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {item.shortDescription || item.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => editService(item)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteService(item._id)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {tab === "projects" && (
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
              <form
                onSubmit={editingProjectId ? updateProject : createProject}
                className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
              >
                <h2 className="text-xl font-semibold">
                  {editingProjectId ? "Edit Project" : "Add Project"}
                </h2>
                <FormField
                  label="Title"
                  value={projectForm.title}
                  onChange={(v) => setProjectForm({ ...projectForm, title: v })}
                />
                <FormField
                  label="Short Description"
                  value={projectForm.shortDescription}
                  onChange={(v) =>
                    setProjectForm({ ...projectForm, shortDescription: v })
                  }
                  textarea
                />
                <FormField
                  label="Description"
                  value={projectForm.description}
                  onChange={(v) =>
                    setProjectForm({ ...projectForm, description: v })
                  }
                  textarea
                />
                <FormField
                  label="Image URL"
                  value={projectForm.image}
                  onChange={(v) => setProjectForm({ ...projectForm, image: v })}
                />
                <FileField
                  label="Upload Image"
                  accept="image/*"
                  capture="environment"
                  onFileSelect={(dataUrl) =>
                    setProjectForm({ ...projectForm, image: dataUrl })
                  }
                  description="Tap Browse to select an image from your device or camera."
                />
                <FormField
                  label="Video URL"
                  value={projectForm.video}
                  onChange={(v) => setProjectForm({ ...projectForm, video: v })}
                />
                <FileField
                  label="Upload Video"
                  accept="video/*"
                  capture="environment"
                  onFileSelect={(dataUrl) =>
                    setProjectForm({ ...projectForm, video: dataUrl })
                  }
                  description="Tap Browse to select a video from your device or camera."
                />
                <FormField
                  label="Link"
                  value={projectForm.link}
                  onChange={(v) => setProjectForm({ ...projectForm, link: v })}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
                  >
                    {editingProjectId ? "Update Project" : "Create Project"}
                  </button>
                  {editingProjectId ? (
                    <button
                      type="button"
                      onClick={cancelProjectEdit}
                      className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Existing Projects</h2>
                {projects.length === 0 ? (
                  <p className="text-slate-500">No projects yet.</p>
                ) : (
                  projects.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-start gap-4"
                    >
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {item.shortDescription || item.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => editProject(item)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProject(item._id)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {tab === "posts" && (
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
              <form
                onSubmit={editingPostId ? updatePost : createPost}
                className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
              >
                <h2 className="text-xl font-semibold">
                  {editingPostId ? "Edit Post" : "Add Post"}
                </h2>
                <FormField
                  label="Title"
                  value={postForm.title}
                  onChange={(v) => setPostForm({ ...postForm, title: v })}
                />
                <FormField
                  label="Summary"
                  value={postForm.summary}
                  onChange={(v) => setPostForm({ ...postForm, summary: v })}
                  textarea
                />
                <FormField
                  label="Content"
                  value={postForm.content}
                  onChange={(v) => setPostForm({ ...postForm, content: v })}
                  textarea
                />
                <FormField
                  label="Image URL"
                  value={postForm.image}
                  onChange={(v) => setPostForm({ ...postForm, image: v })}
                />
                <FileField
                  label="Upload Image"
                  accept="image/*"
                  capture="environment"
                  onFileSelect={(dataUrl) => setPostForm({ ...postForm, image: dataUrl })}
                  description="Tap Browse to select an image from your device or camera."
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
                  >
                    {editingPostId ? "Update Post" : "Create Post"}
                  </button>
                  {editingPostId ? (
                    <button
                      type="button"
                      onClick={cancelPostEdit}
                      className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Existing Posts</h2>
                {posts.length === 0 ? (
                  <p className="text-slate-500">No posts yet.</p>
                ) : (
                  posts.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-start gap-4"
                    >
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {item.summary}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => editPost(item)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePost(item._id)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {tab === "messages" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Contact Messages</h2>
                    <p className="text-sm text-slate-500">
                      Review incoming messages sent through the contact form.
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                    {messages.length} messages
                  </span>
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                  No contact messages yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((item) => (
                    <div
                      key={item._id}
                      className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm text-slate-500">
                            {new Date(item.createdAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {item.subject}
                          </h3>
                        </div>
                        <div className="text-sm text-slate-600">
                          <p>{item.name}</p>
                          <p>{item.email}</p>
                        </div>
                      </div>
                      <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-slate-100 bg-slate-50 p-4 text-slate-700">
                        {item.message}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => deleteMessage(item._id)}
                          className="text-red-600 text-sm font-medium"
                        >
                          Delete message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "about" && (
            <div className="space-y-6 max-w-4xl">
              <form
                onSubmit={saveAbout}
                className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-6"
              >
                <h2 className="text-xl font-semibold">About Page Content</h2>
                <FormField
                  label="History Text"
                  value={about.history?.text || ""}
                  onChange={(v) =>
                    setAbout({
                      ...about,
                      history: { ...about.history, text: v },
                    })
                  }
                  textarea
                />
                <FormField
                  label="Mission"
                  value={about.mission || ""}
                  onChange={(v) => setAbout({ ...about, mission: v })}
                  textarea
                />
                <FormField
                  label="Vision"
                  value={about.vision || ""}
                  onChange={(v) => setAbout({ ...about, vision: v })}
                  textarea
                />
                <FormField
                  label="Values (comma-separated)"
                  value={(about.values || []).join(", ")}
                  onChange={(v) =>
                    setAbout({
                      ...about,
                      values: v.split(",").map((s) => s.trim()),
                    })
                  }
                />
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
                >
                  Save About Page
                </button>
              </form>

              <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Team Members</h2>
                    <p className="text-sm text-slate-500">
                      Add each new employee with their profile image, business contact info, and LinkedIn link.
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                    {(about.team || []).length} members
                  </span>
                </div>

                <form onSubmit={saveTeamMember} className="grid gap-3 md:grid-cols-2">
                  <FormField
                    label="Full name"
                    value={teamMemberForm.name}
                    onChange={(v) => setTeamMemberForm({ ...teamMemberForm, name: v })}
                  />
                  <FormField
                    label="Position title"
                    value={teamMemberForm.role}
                    onChange={(v) => setTeamMemberForm({ ...teamMemberForm, role: v })}
                  />
                  <FormField
                    label="Profile photo URL"
                    value={teamMemberForm.image}
                    onChange={(v) => setTeamMemberForm({ ...teamMemberForm, image: v })}
                  />
                  <FileField
                    label="Upload profile photo"
                    accept="image/*"
                    capture="environment"
                    onFileSelect={(dataUrl) => setTeamMemberForm({ ...teamMemberForm, image: dataUrl })}
                    description="Use a clear headshot for the About page gallery."
                  />
                  <FormField
                    label="Email address"
                    type="email"
                    value={teamMemberForm.email}
                    onChange={(v) => setTeamMemberForm({ ...teamMemberForm, email: v })}
                  />
                  <FormField
                    label="Contact number"
                    type="tel"
                    value={teamMemberForm.phone}
                    onChange={(v) => setTeamMemberForm({ ...teamMemberForm, phone: v })}
                  />
                  <div className="md:col-span-2">
                    <FormField
                      label="LinkedIn profile URL"
                      type="url"
                      value={teamMemberForm.linkedin}
                      onChange={(v) => setTeamMemberForm({ ...teamMemberForm, linkedin: v })}
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-wrap gap-2">
                    <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg">
                      {editingTeamMemberIndex === null ? "Add team member" : "Update team member"}
                    </button>
                    {editingTeamMemberIndex !== null ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTeamMemberIndex(null);
                          setTeamMemberForm(emptyTeamMember);
                        }}
                        className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </form>

                <div className="space-y-3">
                  {(about.team || []).length === 0 ? (
                    <p className="text-sm text-slate-500">No team members have been added yet.</p>
                  ) : (
                    (about.team || []).map((member, index) => (
                      <div key={member._id || `${member.name}-${index}`} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{member.name || "Unnamed team member"}</p>
                          <p className="text-sm text-slate-600">{member.role || "Position title"}</p>
                          {member.email ? <p className="text-sm text-slate-500">{member.email}</p> : null}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => editTeamMember(member, index)} className="text-slate-700 text-sm font-medium">
                            Edit
                          </button>
                          <button type="button" onClick={() => deleteTeamMember(index)} className="text-red-600 text-sm font-medium">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
