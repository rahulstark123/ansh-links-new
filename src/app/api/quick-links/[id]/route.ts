import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { wid, title, url, icon } = body;

    if (!wid) {
      return NextResponse.json({ error: "Missing wid parameter" }, { status: 400 });
    }
    const parsedWid = parseInt(wid, 10);
    if (isNaN(parsedWid)) {
      return NextResponse.json({ error: "Invalid wid parameter" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { wid: parsedWid }
    });

    if (!profile) {
      return NextResponse.json({ error: "Workspace profile not found" }, { status: 404 });
    }

    let updated = false;
    const currentList = profile.quickLinkIds || [];
    const updatedList = currentList.map((item) => {
      try {
        if (item.startsWith("{")) {
          const parsed = JSON.parse(item);
          if (parsed.id === id) {
            updated = true;
            return JSON.stringify({
              id,
              title: title !== undefined ? title.trim() : parsed.title,
              url: url !== undefined ? url.trim() : parsed.url,
              icon: icon !== undefined ? icon : parsed.icon
            });
          }
        }
      } catch (e) {}
      return item;
    });

    if (!updated) {
      const newQuickLink = {
        id,
        title: title || "Quick Link",
        url: url || "",
        icon: icon || "Link2"
      };
      updatedList.push(JSON.stringify(newQuickLink));
    }

    await prisma.profile.update({
      where: { wid: parsedWid },
      data: { quickLinkIds: updatedList }
    });

    return NextResponse.json({ id, title, url, icon });
  } catch (error: any) {
    console.error("PATCH Quick Link Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      return NextResponse.json({ error: "Workspace profile not found" }, { status: 404 });
    }

    const currentList = profile.quickLinkIds || [];
    const updatedList = currentList.filter((item) => {
      try {
        if (item.startsWith("{")) {
          const parsed = JSON.parse(item);
          return parsed.id !== id;
        }
      } catch (e) {}
      return true;
    });

    await prisma.profile.update({
      where: { wid },
      data: { quickLinkIds: updatedList }
    });

    return NextResponse.json({ message: "Quick link deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Quick Link Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
