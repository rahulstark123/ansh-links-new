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

    const profile = await prisma.profile.findUnique({
      where: { wid }
    });

    return NextResponse.json(profile?.hobbies || []);
  } catch (error: any) {
    console.error("GET Hobbies Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wid, hobby } = body;

    if (!wid) {
      return NextResponse.json({ error: "Missing wid parameter" }, { status: 400 });
    }
    const parsedWid = parseInt(wid, 10);
    if (isNaN(parsedWid)) {
      return NextResponse.json({ error: "Invalid wid parameter" }, { status: 400 });
    }

    if (!hobby || !hobby.trim()) {
      return NextResponse.json({ error: "Hobby is required" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { wid: parsedWid }
    });

    if (!profile) {
      return NextResponse.json({ error: "Workspace profile not found" }, { status: 404 });
    }

    const val = hobby.trim();
    const currentList = profile.hobbies || [];
    if (currentList.includes(val)) {
      return NextResponse.json({ error: "Hobby already exists" }, { status: 400 });
    }

    const updatedList = [...currentList, val];

    await prisma.profile.update({
      where: { wid: parsedWid },
      data: { hobbies: updatedList }
    });

    return NextResponse.json({ hobby: val }, { status: 201 });
  } catch (error: any) {
    console.error("POST Hobby Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const widStr = searchParams.get("wid");
    const hobby = searchParams.get("hobby");

    if (!widStr || !hobby) {
      return NextResponse.json({ error: "Missing wid or hobby parameters" }, { status: 400 });
    }
    const wid = parseInt(widStr, 10);
    if (isNaN(wid)) {
      return NextResponse.json({ error: "Invalid wid parameter" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { wid }
    });

    if (!profile) {
      return NextResponse.json({ error: "Workspace profile not found" }, { status: 404 });
    }

    const currentList = profile.hobbies || [];
    const updatedList = currentList.filter((item) => item !== hobby);

    await prisma.profile.update({
      where: { wid },
      data: { hobbies: updatedList }
    });

    return NextResponse.json({ message: "Hobby deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Hobby Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
