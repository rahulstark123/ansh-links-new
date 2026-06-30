import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const widStr = searchParams.get("wid");
    if (!widStr) {
      return NextResponse.json({ error: "Missing wid parameter" }, { status: 400 });
    }
    const wid = parseInt(widStr, 10);
    if (isNaN(wid)) {
      return NextResponse.json({ error: "Invalid wid parameter" }, { status: 400 });
    }

    const fields = await prisma.customField.findMany({
      where: { wid },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(fields);
  } catch (error: any) {
    console.error("GET Custom Fields Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wid, key, value, icon, active } = body;

    if (!wid) {
      return NextResponse.json({ error: "Missing wid parameter" }, { status: 400 });
    }
    const parsedWid = parseInt(wid, 10);
    if (isNaN(parsedWid)) {
      return NextResponse.json({ error: "Invalid wid parameter" }, { status: 400 });
    }

    if (!key?.trim() || !value?.trim()) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { wid: parsedWid },
    });

    if (!profile) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const field = await prisma.customField.create({
      data: {
        wid: parsedWid,
        profileId: profile.id,
        key: key.trim(),
        value: value.trim(),
        icon: icon || "Link2",
        active: active ?? false,
      },
    });

    return NextResponse.json(field, { status: 201 });
  } catch (error: any) {
    console.error("POST Custom Field Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
