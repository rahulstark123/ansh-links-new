import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string; cardId: string }> }
) {
  try {
    const { username, cardId } = await params;

    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        socialLinks: true,
        cards: { where: { id: cardId } },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const card = profile.cards[0];
    if (!card || !card.active) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json({
      card,
      username: profile.username,
      socialLinks: profile.socialLinks,
    });
  } catch (error: unknown) {
    console.error("GET Public Card Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
