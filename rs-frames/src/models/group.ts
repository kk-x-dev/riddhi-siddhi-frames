import { Db, ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export interface GroupDocument {
  _id?: ObjectId;
  name: string;
  slug: string;
  image: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupInput {
  name?: string;
  title?: string;
  image?: string;
  description?: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getGroupsCollection() {
  const client = await clientPromise;
  const db: Db = client.db("frames_store");
  const collection = db.collection<GroupDocument>("groups");

  // Ensure useful indexes exist (idempotent)
  await Promise.all([
    collection.createIndex({ slug: 1 }, { unique: true }),
    collection.createIndex({ createdAt: -1 }),
  ]);

  return collection;
}

export function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}