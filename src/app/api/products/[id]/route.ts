import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { wid, name, price, currency, imageUrl, linkUrl, active } = body;

    // Resolve profileId for this workspace
    let profileId: string | undefined = undefined;
    let parsedWid = wid ? parseInt(wid, 10) : undefined;

    if (parsedWid) {
      const profile = await prisma.profile.findUnique({
        where: { wid: parsedWid }
      });
      profileId = profile?.id;
    }

    // Fallback profile lookup if no profileId resolved yet
    if (!profileId) {
      // Find any profile to link this product to
      const firstProfile = await prisma.profile.findFirst();
      profileId = firstProfile?.id;
      parsedWid = firstProfile?.wid || 1;
    }

    if (!profileId) {
      return NextResponse.json({ error: "No profile found to associate product with" }, { status: 400 });
    }

    // Perform upsert so client-side temp IDs are auto-created if missing from DB
    const updatedProduct = await prisma.product.upsert({
      where: { id },
      update: {
        name: name !== undefined ? name : undefined,
        price: price !== undefined ? price : undefined,
        currency: currency !== undefined ? currency : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        linkUrl: linkUrl !== undefined ? linkUrl : undefined,
        active: active !== undefined ? active : undefined,
      },
      create: {
        id,
        wid: parsedWid!,
        name: name || "Unnamed Product",
        price: price || "0",
        currency: currency || "USD",
        imageUrl: imageUrl || null,
        linkUrl: linkUrl || null,
        active: active ?? true,
        profileId: profileId
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("PATCH Product Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
