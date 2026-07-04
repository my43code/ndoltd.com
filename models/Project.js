import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    shortDescription: { type: String },
    image: { type: String },
    video: { type: String },
    link: { type: String },
  },
  { timestamps: true } 
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
