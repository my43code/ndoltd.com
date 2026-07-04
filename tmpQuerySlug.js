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

const postPath = path.resolve(__dirname, 'models', 'Post.js');
const Post = require(postPath).default || require(postPath);

(async () => {
  try {
    await mongoose.connect(uri);
    const slugs = ['starlink-complete-overview'];
    for (const slug of slugs) {
      const post = await Post.findOne({ slug }).lean();
      console.log('slug', slug, 'post', post ? { id: post._id.toString(), title: post.title, slug: post.slug } : null);
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
