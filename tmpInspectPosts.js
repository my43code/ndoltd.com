const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const envPath = path.resolve(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local not found');
  process.exit(1);
}
const env = dotenv.parse(fs.readFileSync(envPath));
const uri = env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

const postSchema = new mongoose.Schema({
  title: String,
  summary: String,
  content: String,
  image: String,
  slug: String,
}, { timestamps: true });

(async () => {
  try {
    await mongoose.connect(uri);
    const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
    const posts = await Post.find().lean();
    console.log('count', posts.length);
    posts.forEach((p) => {
      console.log(JSON.stringify({ id: p._id?.toString(), slug: p.slug, title: p.title }));
    });
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
