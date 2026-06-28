import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ACTION_LABELS,
  countryCodeToFlag,
  countryCodeToName,
  formatRelativeTime,
  percentChange,
  resolveProfileByWidOrUsername,
  TRAFFIC_ACTIONS,
} from "@/lib/analytics";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wid = searchParams.get("wid") ? Number(searchParams.get("wid")) : null;
    const username = searchParams.get("username");
    const actionFilter = searchParams.get("action") || "all";
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 25)));

    const profile = await resolveProfileByWidOrUsername(prisma, wid, username);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const actionMap: Record<string, string> = {
      "Profile View": TRAFFIC_ACTIONS.PROFILE_VIEW,
      "Link Click": TRAFFIC_ACTIONS.LINK_CLICK,
      "UPI Pay Trigger": TRAFFIC_ACTIONS.UPI_PAY,
      "WhatsApp Chat": TRAFFIC_ACTIONS.WHATSAPP_CHAT,
    };

    const where: any = { wid: profile.wid };

    if (actionFilter !== "all" && actionMap[actionFilter]) {
      const mapped = actionMap[actionFilter];
      if (mapped === TRAFFIC_ACTIONS.LINK_CLICK) {
        where.action = { in: [TRAFFIC_ACTIONS.LINK_CLICK, TRAFFIC_ACTIONS.PRODUCT_CLICK, TRAFFIC_ACTIONS.SOCIAL_CLICK] };
      } else {
        where.action = mapped;
      }
    }

    if (search) {
      where.OR = [
        { country: { contains: search, mode: "insensitive" } },
        { ipAddress: { contains: search } },
        { details: { contains: search, mode: "insensitive" } },
        { browser: { contains: search, mode: "insensitive" } },
      ];
    }

    const [totalHits, currentMonthHits, previousMonthHits, events, sessionEvents] = await Promise.all([
      prisma.trafficEvent.count({ where: { wid: profile.wid } }),
      prisma.trafficEvent.count({
        where: { wid: profile.wid, createdAt: { gte: currentMonthStart } },
      }),
      prisma.trafficEvent.count({
        where: {
          wid: profile.wid,
          createdAt: { gte: previousMonthStart, lte: previousMonthEnd },
        },
      }),
      prisma.trafficEvent.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.trafficEvent.findMany({
        where: { wid: profile.wid, sessionId: { not: null } },
        select: { sessionId: true, createdAt: true, action: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const sessionStats = new Map<string, { count: number; first: Date; last: Date }>();
    for (const event of sessionEvents) {
      if (!event.sessionId) continue;
      const existing = sessionStats.get(event.sessionId);
      if (!existing) {
        sessionStats.set(event.sessionId, {
          count: 1,
          first: event.createdAt,
          last: event.createdAt,
        });
      } else {
        existing.count += 1;
        if (event.createdAt > existing.last) existing.last = event.createdAt;
      }
    }

    let totalDurationMs = 0;
    let durationSessions = 0;
    let bounceSessions = 0;
    const totalSessions = sessionStats.size || 1;

    for (const [, session] of sessionStats) {
      if (session.count === 1) bounceSessions += 1;
      const duration = session.last.getTime() - session.first.getTime();
      if (duration > 0) {
        totalDurationMs += duration;
        durationSessions += 1;
      }
    }

    const avgDurationSeconds =
      durationSessions > 0 ? Math.round(totalDurationMs / durationSessions / 1000) : 0;
    const bounceRate = Number(((bounceSessions / totalSessions) * 100).toFixed(1));

    const countryCounts = await prisma.trafficEvent.groupBy({
      by: ["country"],
      where: { wid: profile.wid, country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 1,
    });

    const topCountryRow = countryCounts[0];
    const topCountry = topCountryRow?.country || "Unknown";
    const topCountryCount = topCountryRow?._count.country || 0;
    const topCountryPercent =
      totalHits > 0 ? Math.round((topCountryCount / totalHits) * 100) : 0;

    const logs = events.map((event) => ({
      id: event.id,
      ip: event.ipAddress || "—",
      country: event.country || countryCodeToName(event.countryCode) || "Unknown",
      flag: countryCodeToFlag(event.countryCode),
      browser: event.browser || "Unknown",
      device: (event.device || "desktop") as "mobile" | "desktop" | "tablet",
      action: ACTION_LABELS[event.action] || event.action,
      details: event.details || "—",
      timestamp: formatRelativeTime(event.createdAt),
      createdAt: event.createdAt.toISOString(),
    }));

    return NextResponse.json({
      wid: profile.wid,
      summary: {
        totalHits,
        totalHitsChange: percentChange(currentMonthHits, previousMonthHits),
        avgDurationSeconds,
        bounceRate,
        topCountry,
        topCountryPercent,
      },
      logs,
      pagination: {
        page,
        limit,
        total: await prisma.trafficEvent.count({ where }),
      },
    });
  } catch (error: any) {
    console.error("Traffic logs error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
