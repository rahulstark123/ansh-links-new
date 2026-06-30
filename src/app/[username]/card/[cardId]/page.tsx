"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";
import DigitalCardFaces from "@/components/cards/DigitalCardFaces";
import { DigitalCard, SocialLink } from "@/store/useProfileStore";
import { getCardPublicUrl } from "@/lib/card-url";

export default function PublicCardPage() {
  const params = useParams();
  const username = Array.isArray(params?.username) ? params.username[0] : params?.username;
  const cardId = Array.isArray(params?.cardId) ? params.cardId[0] : params?.cardId;

  const [card, setCard] = useState<DigitalCard | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username || !cardId) return;

    fetch(`/api/cards/public/${username}/${cardId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setCard(data.card);
        setSocialLinks(data.socialLinks ?? []);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [username, cardId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !card || !username) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4 p-6 text-center">
        <CreditCard className="w-12 h-12 text-slate-300" />
        <h1 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Card not available</h1>
        <p className="text-sm text-slate-400 max-w-sm">
          This digital card may be inactive or no longer exists.
        </p>
        {username && (
          <Link
            href={`/${username}`}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to profile
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/80 dark:bg-slate-950 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between gap-4 px-1">
          <Link
            href={`/${username}`}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            @{username}
          </Link>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-[0.15em]">
            Digital Card
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm">
          <DigitalCardFaces
            card={card}
            username={username}
            socialLinks={socialLinks}
            variant="hero"
          />
        </div>

        <p className="text-center text-xs text-slate-400 px-4 break-all">
          {getCardPublicUrl(username, card.id)}
        </p>
      </div>
    </div>
  );
}
