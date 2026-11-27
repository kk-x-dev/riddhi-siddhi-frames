import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const startTime = Date.now();

  try {
    const client = await clientPromise;
    const db = client.db("frames_store");
    await db.command({ ping: 1 });

    return NextResponse.json(
      {
        ok: true,
        message: "Connected to local MongoDB successfully.",
        dbName: db.databaseName,
        latencyMs: Date.now() - startTime,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown connection error";

    return NextResponse.json(
      {
        ok: false,
        message: "Failed to connect to local MongoDB.",
        error: message,
      },
      { status: 500 }
    );
  }
}