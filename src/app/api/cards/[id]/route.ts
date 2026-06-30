import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    let parsedWid = wid ? parseInt(wid, 10) : undefined;
    let profileId: string | undefined;

    if (parsedWid) {
      const profile = await prisma.profile.findUnique({ where: { wid: parsedWid } });
      profileId = profile?.id;
    }

    const existing = await prisma.digitalCard.findUnique({ where: { id } });

    if (existing) {
      const updated = await prisma.digitalCard.update({
        where: { id },
        data: {
          cardName: cardName !== undefined ? cardName.trim() : undefined,
          jobTitle: jobTitle !== undefined ? jobTitle.trim() : undefined,
          company: company !== undefined ? company.trim() : undefined,
          companyTagline:
            companyTagline !== undefined ? companyTagline.trim() || null : undefined,
          companyLogo:
            companyLogo !== undefined ? companyLogo.trim() || null : undefined,
          phone: phone !== undefined ? phone.trim() : undefined,
          email: email !== undefined ? email.trim() : undefined,
          website: website !== undefined ? website.trim() : undefined,
          theme: theme !== undefined ? theme : undefined,
          active: active !== undefined ? active : undefined,
          qrLink: qrLink !== undefined ? qrLink.trim() || null : undefined,
        },
      });
      return NextResponse.json(updated);
    }

    if (!profileId || !parsedWid) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    if (!cardName?.trim() || !jobTitle?.trim()) {
      return NextResponse.json({ error: "Name and job title are required" }, { status: 400 });
    }

    const created = await prisma.digitalCard.create({
      data: {
        id,
        wid: parsedWid,
        profileId,
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

    return NextResponse.json(created);
  } catch (error: any) {
    console.error("PATCH Card Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.digitalCard.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    await prisma.digitalCard.delete({ where: { id } });
    return NextResponse.json({ message: "Card deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Card Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
