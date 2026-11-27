import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import {
  getGroupsCollection,
  GroupInput,
  isValidObjectId,
  slugify,
} from "@/models/group";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const groups = await getGroupsCollection();

    const group = isValidObjectId(id)
      ? await groups.findOne({ _id: new ObjectId(id) })
      : await groups.findOne({ slug: id });

    if (!group) {
      return NextResponse.json({ ok: false, error: "Group not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, group }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch group";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

async function updateGroupHandler(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ ok: false, error: "Invalid group ID." }, { status: 400 });
    }

    const body = (await req.json()) as GroupInput;
    const groups = await getGroupsCollection();
    const objectId = new ObjectId(id);

    const existing = await groups.findOne({ _id: objectId });
    if (!existing) {
      return NextResponse.json({ ok: false, error: "Group not found." }, { status: 404 });
    }

    const updates: Partial<{
      name: string;
      slug: string;
      image: string;
      description: string;
      updatedAt: Date;
    }> = {
      updatedAt: new Date(),
    };

    const nextName = (body.name ?? body.title)?.trim();
    if (nextName !== undefined) {
      if (!nextName) {
        return NextResponse.json(
          { ok: false, error: "Group name/title cannot be empty." },
          { status: 400 }
        );
      }
      const nextSlug = slugify(nextName);
      if (!nextSlug) {
        return NextResponse.json(
          { ok: false, error: "Group name must contain alphanumeric characters." },
          { status: 400 }
        );
      }

      const conflict = await groups.findOne({
        slug: nextSlug,
        _id: { $ne: objectId },
      });
      if (conflict) {
        return NextResponse.json(
          { ok: false, error: "Another group already uses this name." },
          { status: 409 }
        );
      }

      updates.name = nextName;
      updates.slug = nextSlug;
    }

    if (body.image !== undefined) {
      const nextImage = body.image.trim();
      if (!nextImage) {
        return NextResponse.json(
          { ok: false, error: "Group image cannot be empty." },
          { status: 400 }
        );
      }
      updates.image = nextImage;
    }

    if (body.description !== undefined) {
      updates.description = body.description.trim();
    }

    await groups.updateOne({ _id: objectId }, { $set: updates });
    const updated = await groups.findOne({ _id: objectId });

    return NextResponse.json({ ok: true, group: updated }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update group";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  return updateGroupHandler(req, context);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  return updateGroupHandler(req, context);
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ ok: false, error: "Invalid group ID." }, { status: 400 });
    }

    const objectId = new ObjectId(id);
    const groups = await getGroupsCollection();
    const deleted = await groups.findOneAndDelete({ _id: objectId });

    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Group not found." }, { status: 404 });
    }

    // Cascade delete any items linked to this group
    const client = await clientPromise;
    const itemsCollection = client.db("frames_store").collection("items");
    const itemsCleanup = await itemsCollection.deleteMany({ groupId: objectId });

    return NextResponse.json(
      {
        ok: true,
        message: "Group deleted.",
        deletedGroupId: id,
        deletedItemsCount: itemsCleanup.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete group";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}