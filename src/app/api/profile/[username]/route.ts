import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const lowerUsername = username.toLowerCase();

    let profile = await prisma.profile.findUnique({
      where: { username: lowerUsername },
      include: {
        links: true,
        socialLinks: true,
        cards: true,
        products: true,
        integrations: true,
      },
    });

    // If profile not found and it is the default username "ansh", seed it.
    if (!profile && lowerUsername === "ansh") {
      profile = await prisma.$transaction(async (tx) => {
        const newProfile = await tx.profile.create({
          data: {
            username: "ansh",
            name: "Ansh Kumar",
            bio: "Building the future of digital identity. Curator of fine aesthetics & organic minimalism. Founder at ANSH TREE.",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqT4rFFksHBC8kuoflJDQrqOF2rNbdHxZ_ZjYQcDY5h22g9Q7IxKY8M4FlczsG9LAcjHvUfwmRiSJfU8X6UogSgWObI1kIRRdBCpNLFrU3fLXQQE2FIRcTVHEjBVszDPDz-T5r9WbwdeyzMXkoiNPe95WkxzDo7P6wHF4fwKBrB-f3j8ZzFQWD1Z40kA4VuUq94NcT7S_YGkeweZvikknSxyQ3JJ9dtyC_sWBud7OU6BUQkjPrVHw_9Mqm3Dazha8xKvUBkOBgh9HI",
            verified: true,
            theme: "organic",
            bgStyle: "mesh",
            upiId: "ansh@upi",
            whatsappNumber: "+919876543210",
            hobbies: ["📚 Reading", "💻 Coding", "✈️ Traveling", "🎨 Design"],
            currentlyExploring: "Next.js 16 & Tailwind v4",
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            subscriptionStatus: "trial",
          },
        });

        await tx.link.createMany({
          data: [
            {
              title: "ANSH TREE Platform",
              subtitle: "Centralized digital sanctuary",
              url: "https://anshapps.com/tree",
              icon: "Network",
              active: true,
              profileId: newProfile.id,
            },
            {
              title: "Design Portfolio",
              subtitle: "Editorial and UI explorations",
              url: "https://anshapps.com/portfolio",
              icon: "Palette",
              active: true,
              profileId: newProfile.id,
            },
            {
              title: "Reading List",
              subtitle: "Curated books on tech & philosophy",
              url: "https://anshapps.com/reading",
              icon: "BookOpen",
              active: true,
              profileId: newProfile.id,
            },
          ],
        });

        await tx.socialLink.createMany({
          data: [
            { platform: "website", url: "https://anshapps.com", profileId: newProfile.id },
            { platform: "email", url: "mailto:ansh@anshapps.com", profileId: newProfile.id },
            { platform: "linkedin", url: "https://linkedin.com", profileId: newProfile.id },
          ],
        });

        await tx.digitalCard.createMany({
          data: [
            {
              cardName: "Ansh Kumar",
              jobTitle: "Founder & CEO",
              company: "ANSH Apps Suite",
              phone: "+91 98765 43210",
              email: "ansh@anshapps.com",
              website: "https://anshapps.com",
              theme: "gold",
              active: true,
              profileId: newProfile.id,
            },
          ],
        });

        await tx.product.createMany({
          data: [
            {
              name: "Minimalist Resume Template",
              price: "19.00",
              currency: "USD",
              imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&auto=format&fit=crop&q=80",
              linkUrl: "https://anshapps.com/tree",
              active: true,
              profileId: newProfile.id,
            },
            {
              name: "Next.js Boilerplate Bundle",
              price: "49.00",
              currency: "USD",
              imageUrl: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=400&auto=format&fit=crop&q=80",
              linkUrl: "https://anshapps.com/tree",
              active: true,
              profileId: newProfile.id,
            },
          ],
        });

        await tx.integration.createMany({
          data: [
            { provider: "stripe", connected: false, profileId: newProfile.id },
            { provider: "mailchimp", connected: false, profileId: newProfile.id },
            { provider: "analytics", connected: false, profileId: newProfile.id },
          ],
        });

        return tx.profile.findUnique({
          where: { id: newProfile.id },
          include: {
            links: true,
            socialLinks: true,
            cards: true,
            products: true,
            integrations: true,
          },
        });
      });
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("GET Profile Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const lowerUsername = username.toLowerCase();
    const body = await request.json();

    const {
      name,
      bio,
      avatar,
      verified,
      theme,
      bgStyle,
      upiId,
      whatsappNumber,
      hobbies,
      currentlyExploring,
      trialEndsAt,
      subscriptionStatus,
      links,
      socialLinks,
      cards,
      products,
      integrations,
    } = body;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Upsert profile details
      const profile = await tx.profile.upsert({
        where: { username: lowerUsername },
        update: {
          name,
          bio,
          avatar,
          verified,
          theme,
          bgStyle,
          upiId,
          whatsappNumber,
          hobbies: hobbies || [],
          currentlyExploring,
          trialEndsAt: trialEndsAt ? new Date(trialEndsAt) : undefined,
          subscriptionStatus,
        },
        create: {
          username: lowerUsername,
          name,
          bio,
          avatar,
          verified,
          theme,
          bgStyle,
          upiId,
          whatsappNumber,
          hobbies: hobbies || [],
          currentlyExploring,
          trialEndsAt: trialEndsAt ? new Date(trialEndsAt) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          subscriptionStatus: subscriptionStatus || "trial",
        },
      });

      // 2. Synchronize links
      await tx.link.deleteMany({ where: { profileId: profile.id } });
      if (links && links.length > 0) {
        await tx.link.createMany({
          data: links.map((l: any) => ({
            title: l.title,
            url: l.url,
            subtitle: l.subtitle || null,
            icon: l.icon || null,
            active: l.active ?? true,
            profileId: profile.id,
          })),
        });
      }

      // 3. Synchronize social links
      await tx.socialLink.deleteMany({ where: { profileId: profile.id } });
      if (socialLinks && socialLinks.length > 0) {
        await tx.socialLink.createMany({
          data: socialLinks.map((s: any) => ({
            platform: s.platform,
            url: s.url,
            profileId: profile.id,
          })),
        });
      }

      // 4. Synchronize digital cards
      await tx.digitalCard.deleteMany({ where: { profileId: profile.id } });
      if (cards && cards.length > 0) {
        await tx.digitalCard.createMany({
          data: cards.map((c: any) => ({
            cardName: c.cardName,
            jobTitle: c.jobTitle,
            company: c.company,
            companyTagline: c.companyTagline || null,
            phone: c.phone,
            email: c.email,
            website: c.website,
            theme: c.theme,
            active: c.active ?? true,
            qrLink: c.qrLink || null,
            profileId: profile.id,
          })),
        });
      }

      // 5. Synchronize products
      await tx.product.deleteMany({ where: { profileId: profile.id } });
      if (products && products.length > 0) {
        await tx.product.createMany({
          data: products.map((p: any) => ({
            name: p.name,
            price: p.price,
            currency: p.currency || "USD",
            imageUrl: p.imageUrl || null,
            linkUrl: p.linkUrl || null,
            active: p.active ?? true,
            profileId: profile.id,
          })),
        });
      }

      // 6. Synchronize integrations
      await tx.integration.deleteMany({ where: { profileId: profile.id } });
      if (integrations && integrations.length > 0) {
        await tx.integration.createMany({
          data: integrations.map((i: any) => ({
            provider: i.provider,
            connected: i.connected ?? false,
            apiKey: i.apiKey || null,
            profileId: profile.id,
          })),
        });
      }

      return tx.profile.findUnique({
        where: { id: profile.id },
        include: {
          links: true,
          socialLinks: true,
          cards: true,
          products: true,
          integrations: true,
        },
      });
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("POST Profile Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
