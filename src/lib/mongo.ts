import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI in your .env file");
}

const cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      console.log("✅ Connected to DB:", mongoose.connection.name);
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

