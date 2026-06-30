import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { wid, key, value, icon, active } = body;

    let parsedWid = wid ? parseInt(wid, 10) : undefined;
    let profileId: string | undefined;

    if (parsedWid) {
      const profile = await prisma.profile.findUnique({ where: { wid: parsedWid } });
      profileId = profile?.id;
    }

    const existing = await prisma.customField.findUnique({ where: { id } });

    if (existing) {
      const updated = await prisma.customField.update({
        where: { id },
        data: {
          key: key !== undefined ? key.trim() : undefined,
          value: value !== undefined ? value.trim() : undefined,
          icon: icon !== undefined ? icon : undefined,
          active: active !== undefined ? active : undefined,
        },
      });
      return NextResponse.json(updated);
    }

    if (!profileId || !parsedWid) {
      return NextResponse.json({ error: "Custom field not found" }, { status: 404 });
    }

    if (!key?.trim() || !value?.trim()) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
    }

    const created = await prisma.customField.create({
      data: {
        id,
        wid: parsedWid,
        profileId,
        key: key.trim(),
        value: value.trim(),
        icon: icon || "Link2",
        active: active ?? false,
      },
    });

    return NextResponse.json(created);
  } catch (error: any) {
    console.error("PATCH Custom Field Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.customField.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Custom field not found" }, { status: 404 });
    }

    await prisma.customField.delete({ where: { id } });
    return NextResponse.json({ message: "Custom field deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Custom Field Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
