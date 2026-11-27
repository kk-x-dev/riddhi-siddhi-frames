import { NextRequest, NextResponse } from "next/server";
import { getGroupsCollection, GroupDocument, GroupInput, slugify } from "@/models/group";

export async function GET() {
  try {
    const groups = await getGroupsCollection();

    const data = await groups
      .aggregate([
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "items",
            localField: "_id",
            foreignField: "groupId",
            as: "groupItems",
          },
        },
        {
          $addFields: {
            itemCount: { $size: "$groupItems" },
          },
        },
        {
          $project: {
            groupItems: 0,
          },
        },
      ])
      .toArray();

    return NextResponse.json({ ok: true, groups: data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch groups";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GroupInput;
    const rawName = (body.name ?? body.title ?? "").trim();
    const image = (body.image ?? "").trim();
    const description = (body.description ?? "").trim();

    if (!rawName) {
      return NextResponse.json(
        { ok: false, error: "Group name/title is required." },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { ok: false, error: "Group image URL/path is required." },
        { status: 400 }
      );
    }

    const slug = slugify(rawName);
    if (!slug) {
      return NextResponse.json(
        { ok: false, error: "Group name must contain alphanumeric characters." },
        { status: 400 }
      );
    }

    const groups = await getGroupsCollection();
    const existing = await groups.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "A group with a similar name already exists." },
        { status: 409 }
      );
    }

    const now = new Date();
    const newGroup: GroupDocument = {
      name: rawName,
      slug,
      image,
      description,
      createdAt: now,
      updatedAt: now,
    };

    const result = await groups.insertOne(newGroup);
    const created = await groups.findOne({ _id: result.insertedId });

    return NextResponse.json({ ok: true, group: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create group";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}