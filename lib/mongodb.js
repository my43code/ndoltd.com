import mongoose from "mongoose";

const globalWithMongoose = globalThis;

if (!globalWithMongoose.__mongoose) {
  globalWithMongoose.__mongoose = { conn: null, promise: null };
}

let cached = globalWithMongoose.__mongoose;

export async function connectMongoDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", false);
    mongoose.set("bufferCommands", false);

    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongooseInstance) => {
        cached.conn = mongooseInstance;
        return mongooseInstance;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
