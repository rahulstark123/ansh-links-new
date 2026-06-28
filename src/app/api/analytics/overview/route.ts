import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  TRAFFIC_ACTIONS,
  getReferrerColor,
  isClickAction,
  normalizeReferrer,
  percentChange,
  resolveProfileByWidOrUsername,
} from "@/lib/analytics";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dayLabel(date: Date, index: number, total: number) {
  if (index === total - 1) return "Today";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wid = searchParams.get("wid") ? Number(searchParams.get("wid")) : null;
    const username = searchParams.get("username");
    const days = Math.min(Number(searchParams.get("days") || 12), 30);

    const profile = await resolveProfileByWidOrUsername(prisma, wid, username);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const now = new Date();
    const rangeStart = startOfDay(new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000));
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [rangeEvents, currentMonthEvents, previousMonthEvents] = await Promise.all([
      prisma.trafficEvent.findMany({
        where: { wid: profile.wid, createdAt: { gte: rangeStart } },
        select: { action: true, createdAt: true, referrer: true, device: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.trafficEvent.findMany({
        where: { wid: profile.wid, createdAt: { gte: currentMonthStart } },
        select: { action: true },
      }),
      prisma.trafficEvent.findMany({
        where: {
          wid: profile.wid,
          createdAt: { gte: previousMonthStart, lte: previousMonthEnd },
        },
        select: { action: true },
      }),
    ]);

    const countViews = (events: { action: string }[]) =>
      events.filter((e) => e.action === TRAFFIC_ACTIONS.PROFILE_VIEW).length;
    const countClicks = (events: { action: string }[]) =>
      events.filter((e) => isClickAction(e.action)).length;

    const totalViews = countViews(rangeEvents);
    const totalClicks = countClicks(rangeEvents);
    const ctr = totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(1)) : 0;

    const curViews = countViews(currentMonthEvents);
    const prevViews = countViews(previousMonthEvents);
    const curClicks = countClicks(currentMonthEvents);
    const prevClicks = countClicks(previousMonthEvents);
    const curCtr = curViews > 0 ? (curClicks / curViews) * 100 : 0;
    const prevCtr = prevViews > 0 ? (prevClicks / prevViews) * 100 : 0;

    const dailyBuckets: Record<string, { views: number; clicks: number }> = {};
    for (let i = 0; i < days; i++) {
      const d = startOfDay(new Date(rangeStart.getTime() + i * 24 * 60 * 60 * 1000));
      dailyBuckets[d.toISOString()] = { views: 0, clicks: 0 };
    }

    for (const event of rangeEvents) {
      const key = startOfDay(event.createdAt).toISOString();
      if (!dailyBuckets[key]) continue;
      if (event.action === TRAFFIC_ACTIONS.PROFILE_VIEW) dailyBuckets[key].views += 1;
      else if (isClickAction(event.action)) dailyBuckets[key].clicks += 1;
    }

    const dailyTraffic = Object.entries(dailyBuckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([iso, counts], index, arr) => ({
        name: dayLabel(new Date(iso), index, arr.length),
        Views: counts.views,
        Clicks: counts.clicks,
        date: iso,
      }));

    const referrerMap: Record<string, number> = {};
    for (const event of rangeEvents) {
      if (event.action !== TRAFFIC_ACTIONS.PROFILE_VIEW) continue;
      const name = normalizeReferrer(event.referrer);
      referrerMap[name] = (referrerMap[name] || 0) + 1;
    }

    const referrers = Object.entries(referrerMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, views]) => ({
        name,
        views,
        fill: getReferrerColor(name),
      }));

    const deviceMap: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
    for (const event of rangeEvents) {
      const device = (event.device || "desktop") as keyof typeof deviceMap;
      if (deviceMap[device] !== undefined) deviceMap[device] += 1;
      else deviceMap.desktop += 1;
    }

    const deviceTotal = Object.values(deviceMap).reduce((a, b) => a + b, 0) || 1;
    const devices = [
      { name: "Mobile", percentage: Math.round((deviceMap.mobile / deviceTotal) * 100), key: "mobile" },
      { name: "Desktop", percentage: Math.round((deviceMap.desktop / deviceTotal) * 100), key: "desktop" },
      { name: "Tablet", percentage: Math.round((deviceMap.tablet / deviceTotal) * 100), key: "tablet" },
    ];

    const mobileScore = Math.min(100, 70 + Math.round((deviceMap.mobile / deviceTotal) * 30));

    return NextResponse.json({
      wid: profile.wid,
      stats: {
        totalViews,
        totalClicks,
        ctr,
        viewsChange: percentChange(curViews, prevViews),
        clicksChange: percentChange(curClicks, prevClicks),
        ctrChange: Number((curCtr - prevCtr).toFixed(1)),
      },
      dailyTraffic,
      referrers,
      devices,
      mobileScore,
    });
  } catch (error: any) {
    console.error("Analytics overview error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
