import { connectMongoDB } from "@/lib/mongodb";
import About from "@/models/About";
import { createDefaultAbout, createDefaultContact, normalizeAboutContent } from "@/lib/siteDefaults";

const defaultContact = createDefaultContact();
const ABOUT_CACHE_MS = 30 * 1000;

const globalWithSiteCache = globalThis;
if (!globalWithSiteCache.__siteAboutCache) {
  globalWithSiteCache.__siteAboutCache = { data: null, expires: 0 };
}

const aboutCache = globalWithSiteCache.__siteAboutCache;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function clearSiteAboutCache() {
  aboutCache.data = null;
  aboutCache.expires = 0;
}

export async function getSiteAbout() {
  if (aboutCache.data && aboutCache.expires > Date.now()) {
    return aboutCache.data;
  }

  try {
    await connectMongoDB();

    let about = await About.findOne().sort({ createdAt: -1 });

    if (!about) {
      const created = await About.create(createDefaultAbout());
      const normalized = normalizeAboutContent(created.toObject());
      aboutCache.data = normalized;
      aboutCache.expires = Date.now() + ABOUT_CACHE_MS;
      return normalized;
    }

    const normalized = normalizeAboutContent(about.toObject());
    const currentContact = about.contact || {};
    const contactNeedsBackfill = Object.keys(defaultContact).some(
      (key) => !isNonEmptyString(currentContact[key])
    );

    if (contactNeedsBackfill) {
      about = await About.findByIdAndUpdate(
        about._id,
        { contact: normalized.contact },
        { new: true }
      );
    }

    const fresh = normalizeAboutContent(about.toObject());
    aboutCache.data = fresh;
    aboutCache.expires = Date.now() + ABOUT_CACHE_MS;
    return fresh;
  } catch (error) {
    if (process.env.npm_lifecycle_event !== "build") {
      console.error("Failed to load about content:", error);
    }
    return createDefaultAbout();
  }
}
