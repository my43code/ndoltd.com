import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    text: String,
    image: String,
    video: String,
  },
  { _id: false }
);

const TeamMemberSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    image: String,
    video: String,
    email: String,
    phone: String,
    linkedin: String,
  },
  { _id: true }
);

const AboutProjectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    video: String,
    link: String,
  },
  { _id: true }
);

const ContactSchema = new mongoose.Schema(
  {
    companyName: String,
    tagline: String,
    address: String,
    email: String,
    phone: String,
    whatsapp: String,
    hours: String,
    mapUrl: String,
    facebook: String,
    linkedin: String,
    x: String,
  },
  { _id: false }
);

const AboutSchema = new mongoose.Schema(
  {
    history: MediaSchema,
    mission: String,
    vision: String,
    values: [String],
    mvv: MediaSchema,
    team: [TeamMemberSchema],
    projects: [AboutProjectSchema],
    contact: {
      type: ContactSchema,
      default: () => ({
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
      }),
    },
  },
  { timestamps: true }
);

export default mongoose.models.About || mongoose.model("About", AboutSchema);
