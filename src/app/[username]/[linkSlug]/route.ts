import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseUserAgent, getClientIp, getCountryFromHeaders } from "@/lib/analytics";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string; linkSlug: string }> }
) {
  try {
    const { username, linkSlug } = await params;
    const lowerUsername = username.toLowerCase();

    // Find the link by its custom slug (id) and matching username
    const link = await prisma.link.findFirst({
      where: {
        id: linkSlug,
        profile: {
          username: lowerUsername,
        },
        active: true,
      },
      include: {
        profile: true,
      },
    });

    // Fallback: If not found, redirect to the main profile page
    if (!link) {
      return NextResponse.redirect(new URL(`/${username}`, request.url));
    }

    // Server-side click tracking (create TrafficEvent record)
    try {
      const userAgent = request.headers.get("user-agent") || "";
      const parsed = parseUserAgent(userAgent);
      const geo = getCountryFromHeaders(request);

      await prisma.trafficEvent.create({
        data: {
          wid: link.wid,
          profileId: link.profileId,
          action: "LINK_CLICK",
          details: `Redirected via short link /${username}/${linkSlug}`,
          linkId: link.id,
          ipAddress: getClientIp(request),
          country: geo.country,
          countryCode: geo.countryCode,
          referrer: request.headers.get("referer") || null,
          browser: parsed.browser,
          device: parsed.device,
          userAgent: userAgent || null,
        },
      });
    } catch (trackError) {
      console.error("Failed to track redirect event:", trackError);
    }

    // Perform HTTP 307 Temporary Redirect to the target destination
    return NextResponse.redirect(new URL(link.url));
  } catch (error) {
    console.error("Redirect handler error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
