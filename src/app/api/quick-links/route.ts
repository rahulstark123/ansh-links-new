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

    if (!profile) {
      return NextResponse.json([]);
    }

    const rawLinks = profile.quickLinkIds || [];
    const quickLinks = rawLinks
      .map((item) => {
        try {
          if (item.startsWith("{")) {
            return JSON.parse(item);
          }
        } catch (e) {}
        return null;
      })
      .filter((item) => item !== null);

    return NextResponse.json(quickLinks);
  } catch (error: any) {
    console.error("GET Quick Links Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wid, title, url, icon } = body;

    if (!wid) {
      return NextResponse.json({ error: "Missing wid parameter" }, { status: 400 });
    }
    const parsedWid = parseInt(wid, 10);
    if (isNaN(parsedWid)) {
      return NextResponse.json({ error: "Invalid wid parameter" }, { status: 400 });
    }

    if (!title || !url) {
      return NextResponse.json({ error: "Title and URL are required" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { wid: parsedWid }
    });

    if (!profile) {
      return NextResponse.json({ error: "Workspace profile not found" }, { status: 404 });
    }

    const newQuickLink = {
      id: `ql-${Date.now()}`,
      title: title.trim(),
      url: url.trim(),
      icon: icon || "Link2"
    };

    const currentList = profile.quickLinkIds || [];
    const updatedList = [...currentList, JSON.stringify(newQuickLink)];

    await prisma.profile.update({
      where: { wid: parsedWid },
      data: { quickLinkIds: updatedList }
    });

    return NextResponse.json(newQuickLink, { status: 201 });
  } catch (error: any) {
    console.error("POST Quick Link Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
