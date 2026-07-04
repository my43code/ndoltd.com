import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: "/images/project1.webp" },

    
 // ✅ ADD THIS BLOCK
    slug: { 
      type: String, 
      required: true, 
      unique: true 
    },

    
  },
  
  {
    timestamps: true,
  }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
