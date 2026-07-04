import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    shortDescription: String,
    image: String,
    video: String,
    link: String,
    icon: String, // store icon name if needed
  },
  { timestamps: true }
);

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);