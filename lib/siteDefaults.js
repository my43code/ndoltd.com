const defaultContact = {
  companyName: "Nexus DevOps Limited",
  tagline: "Digital systems, modern websites, and dependable support.",
  address: "Port Moresby, Papua New Guinea",
  email: "info@ndoltd.com", 
  phone: "+675 78337326",
  whatsapp: "+675 78337326",
  hours: "Monday to Friday, 8:00 AM to 5:00 PM",
  mapUrl: "https://www.google.com/maps?q=Port+Moresby+Papua+New+Guinea",
  facebook: "https://www.facebook.com/",
  linkedin: "https://www.linkedin.com/",
  x: "https://x.com/", 
};

function createDefaultMedia() {
  return {
    text: "",
    image: "",
    video: "",
  };
}

function normalizeTeamMember(member) {
  const source = member || {};
  return {
    name: isNonEmptyString(source.name) ? source.name.trim() : "",
    role: isNonEmptyString(source.role) ? source.role.trim() : "",
    image: isNonEmptyString(source.image) ? source.image.trim() : "",
    video: isNonEmptyString(source.video) ? source.video.trim() : "",
    email: isNonEmptyString(source.email) ? source.email.trim() : "",
    phone: isNonEmptyString(source.phone) ? source.phone.trim() : "",
    linkedin: isNonEmptyString(source.linkedin) ? source.linkedin.trim() : "",
  };
}

export function createDefaultContact() {
  return { ...defaultContact };
}

export function createDefaultAbout() {
  return {
    history: createDefaultMedia(),
    mission: "",
    vision: "",
    values: [],
    mvv: createDefaultMedia(),
    team: [],
    projects: [],
    contact: createDefaultContact(),
  };
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeMedia(source, fallback) {
  return {
    ...fallback,
    ...(source || {}),
  };
}

function normalizeEmail(value) {
  const email = value?.trim();
  if (!isNonEmptyString(email)) return "";
  if (/^info@ndo\.com$/i.test(email)) {
    return "info@ndoltd.com";
  }
  return email;
}

export function normalizeAboutContent(about) {
  const source = about || {};
  const defaultAbout = createDefaultAbout();
  const contactSource = source.contact || {};

  return {
    ...defaultAbout,
    ...source,
    history: normalizeMedia(source.history, defaultAbout.history),
    mvv: normalizeMedia(source.mvv, defaultAbout.mvv),
    contact: {
      companyName: isNonEmptyString(contactSource.companyName)
        ? contactSource.companyName
        : defaultAbout.contact.companyName,
      tagline: isNonEmptyString(contactSource.tagline)
        ? contactSource.tagline
        : defaultAbout.contact.tagline,
      address: isNonEmptyString(contactSource.address)
        ? contactSource.address
        : defaultAbout.contact.address,
      email: isNonEmptyString(contactSource.email)
        ? normalizeEmail(contactSource.email)
        : defaultAbout.contact.email,
      phone: isNonEmptyString(contactSource.phone)
        ? contactSource.phone
        : defaultAbout.contact.phone,
      whatsapp: isNonEmptyString(contactSource.whatsapp)
        ? contactSource.whatsapp
        : defaultAbout.contact.whatsapp,
      hours: isNonEmptyString(contactSource.hours)
        ? contactSource.hours
        : defaultAbout.contact.hours,
      mapUrl: isNonEmptyString(contactSource.mapUrl)
        ? contactSource.mapUrl
        : defaultAbout.contact.mapUrl,
      facebook: isNonEmptyString(contactSource.facebook)
        ? contactSource.facebook
        : defaultAbout.contact.facebook,
      linkedin: isNonEmptyString(contactSource.linkedin)
        ? contactSource.linkedin
        : defaultAbout.contact.linkedin,
      x: isNonEmptyString(contactSource.x)
        ? contactSource.x
        : defaultAbout.contact.x,
    },
    values: Array.isArray(source.values)
      ? source.values.filter(isNonEmptyString)
      : [],
    team: Array.isArray(source.team)
      ? source.team.map(normalizeTeamMember).filter((member) => member.name || member.role || member.email || member.phone || member.linkedin || member.image || member.video)
      : [],
    projects: Array.isArray(source.projects) ? source.projects : [],
  };
}
