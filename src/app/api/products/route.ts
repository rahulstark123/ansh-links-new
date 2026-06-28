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

    const products = await prisma.product.findMany({
      where: { wid },
      orderBy: { id: "asc" }
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wid, name, price, currency, imageUrl, linkUrl, active } = body;

    if (!wid) {
      return NextResponse.json({ error: "Missing wid parameter" }, { status: 400 });
    }
    const parsedWid = parseInt(wid, 10);
    if (isNaN(parsedWid)) {
      return NextResponse.json({ error: "Invalid wid parameter" }, { status: 400 });
    }

    if (!name || !price) {
      return NextResponse.json({ error: "Name and Price are required" }, { status: 400 });
    }

    // Resolve profileId for this workspace
    const profile = await prisma.profile.findUnique({
      where: { wid: parsedWid }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile/Workspace not found" }, { status: 404 });
    }

    const newProduct = await prisma.product.create({
      data: {
        wid: parsedWid,
        name,
        price,
        currency: currency || "USD",
        imageUrl: imageUrl || null,
        linkUrl: linkUrl || null,
        active: active ?? true,
        profileId: profile.id
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("POST Products Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
