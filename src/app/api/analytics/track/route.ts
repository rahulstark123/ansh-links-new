import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  TRAFFIC_ACTIONS,
  getClientIp,
  getCountryFromHeaders,
  parseUserAgent,
  resolveProfileByWidOrUsername,
} from "@/lib/analytics";

const ALLOWED_ACTIONS = new Set(Object.values(TRAFFIC_ACTIONS));

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      username,
      wid,
      action,
      details,
      linkId,
      referrer,
      sessionId,
      userAgent,
      device: clientDevice,
      browser: clientBrowser,
    } = body;

    if (!action || !ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const profile = await resolveProfileByWidOrUsername(prisma, wid, username);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const parsed = parseUserAgent(userAgent);
    const geo = getCountryFromHeaders(request);

    await prisma.trafficEvent.create({
      data: {
        wid: profile.wid,
        profileId: profile.id,
        action,
        details: details || null,
        linkId: linkId || null,
        ipAddress: getClientIp(request),
        country: geo.country,
        countryCode: geo.countryCode,
        referrer: referrer || null,
        browser: clientBrowser || parsed.browser,
        device: clientDevice || parsed.device,
        userAgent: userAgent || null,
        sessionId: sessionId || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Track analytics error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
