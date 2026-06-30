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

    const cards = await prisma.digitalCard.findMany({
      where: { wid },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(cards);
  } catch (error: any) {
    console.error("GET Cards Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      wid,
      cardName,
      jobTitle,
      company,
      companyTagline,
      companyLogo,
      phone,
      email,
      website,
      theme,
      active,
      qrLink,
    } = body;

    if (!wid) {
      return NextResponse.json({ error: "Missing wid parameter" }, { status: 400 });
    }
    const parsedWid = parseInt(wid, 10);
    if (isNaN(parsedWid)) {
      return NextResponse.json({ error: "Invalid wid parameter" }, { status: 400 });
    }

    if (!cardName?.trim() || !jobTitle?.trim()) {
      return NextResponse.json({ error: "Name and job title are required" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { wid: parsedWid },
    });

    if (!profile) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const card = await prisma.digitalCard.create({
      data: {
        wid: parsedWid,
        profileId: profile.id,
        cardName: cardName.trim(),
        jobTitle: jobTitle.trim(),
        company: company?.trim() || "",
        companyTagline: companyTagline?.trim() || null,
        companyLogo: companyLogo?.trim() || null,
        phone: phone?.trim() || "",
        email: email?.trim() || "",
        website: website?.trim() || "",
        theme: theme || "noir",
        active: active ?? true,
        qrLink: qrLink?.trim() || null,
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error: any) {
    console.error("POST Card Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
