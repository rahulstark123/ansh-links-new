"use client";

import { useState, useRef, useEffect } from "react";
import { useProfileStore, DigitalCard } from "@/store/useProfileStore";
import CardModal from "@/components/dashboard/CardModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import {
  createCard,
  updateCardApi,
  deleteCard,
  fetchCards,
} from "@/lib/cards-api";
import DigitalCardFaces from "@/components/cards/DigitalCardFaces";
import { getCardPublicUrl } from "@/lib/card-url";
import { Plus, CreditCard, Edit2, Trash2, ToggleLeft, ToggleRight, Link2, ExternalLink, Copy, Check } from "lucide-react";


export default function MyCardsPanel() {
  const { profile, updateProfileInfo } = useProfileStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<DigitalCard | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingCard, setDeletingCard] = useState<DigitalCard | null>(null);

  const cardsList = profile.cards || [];

  useEffect(() => {
    if (!profile.wid) return;
    fetchCards(profile.wid)
      .then((loaded) => updateProfileInfo({ cards: loaded }))
      .catch(console.error);
  }, [profile.wid]);

  const requireWid = () => {
    if (!profile.wid) {
      alert("Workspace ID not found. Please reload your profile.");
      return false;
    }
    return true;
  };

  const handleOpenCreate = () => {
    setEditingCard(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (card: DigitalCard) => {
    setEditingCard(card);
    setModalOpen(true);
  };

  const handleOpenDelete = (card: DigitalCard) => {
    setDeletingCard(card);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCard) return;
    try {
      await deleteCard(deletingCard.id);
      updateProfileInfo({
        cards: cardsList.filter((c) => c.id !== deletingCard.id),
      });
      setDeletingCard(null);
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
  };

  const handleSaveCard = async (cardData: Omit<DigitalCard, "id">) => {
    if (!requireWid()) return;
    if (editingCard) {
      const saved = await updateCardApi(editingCard.id, profile.wid!, cardData);
      updateProfileInfo({
        cards: cardsList.map((c) => (c.id === saved.id ? saved : c)),
      });
    } else {
      const saved = await createCard(profile.wid!, cardData);
      updateProfileInfo({ cards: [...cardsList, saved] });
    }
  };

  const handleToggleActive = async (card: DigitalCard) => {
    if (!requireWid()) return;
    try {
      const saved = await updateCardApi(card.id, profile.wid!, { active: !card.active });
      updateProfileInfo({
        cards: cardsList.map((c) => (c.id === saved.id ? saved : c)),
      });
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
  };

  return (
    <div className="p-8 sm:p-10 space-y-8 w-full animate-fadeIn font-sans">
      
      {/* Panel Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-8 shadow-sm transition-colors duration-300">
        <div className="space-y-2">
          <h3 className="font-black text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
            <CreditCard className="w-5.5 h-5.5" />
            My Digital Business Cards
          </h3>
          <p className="text-sm text-slate-400">
            Create and manage luxury responsive contact cards. Displaying Front & Back mockup sheets.
          </p>
        </div>
        
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white primary-gradient text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform cursor-pointer shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          Create New Card
        </button>
      </div>

      {/* Cards Grid */}
      <div className="space-y-12">
        {cardsList.map((card) => (
          <InteractiveDoubleSidedCard
            key={card.id}
            card={card}
            onEdit={() => handleOpenEdit(card)}
            onDelete={() => handleOpenDelete(card)}
            onToggleActive={() => handleToggleActive(card)}
          />
        ))}

        {cardsList.length === 0 && (
          <div className="text-center py-24 bg-white dark:bg-slate-900 border border-dashed border-outline-variant/10 rounded-3xl p-8 text-slate-400 space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-300">
              <CreditCard className="w-7 h-7" />
            </div>
            <p className="text-base font-bold">No digital cards created yet</p>
            <p className="text-xs">Click the "Create New Card" button above to craft your first corporate sheet.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Card Modal */}
      <CardModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        cardToEdit={editingCard}
        onSave={handleSaveCard}
      />

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={deletingCard?.cardName}
      />

    </div>
  );
}

interface InteractiveDoubleSidedCardProps {
  card: DigitalCard;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

function InteractiveDoubleSidedCard({ card, onEdit, onDelete, onToggleActive }: InteractiveDoubleSidedCardProps) {
  const { profile } = useProfileStore();
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const [frontTilt, setFrontTilt] = useState({});
  const [backTilt, setBackTilt] = useState({});
  const [copied, setCopied] = useState(false);

  const publicUrl = profile.username ? getCardPublicUrl(profile.username, card.id) : "";

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    ref: React.RefObject<HTMLDivElement | null>,
    setTilt: (style: React.CSSProperties) => void
  ) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width - 0.5) * 2;
    const yPct = (y / rect.height - 0.5) * 2;

    const maxTilt = 12;
    const tiltX = (yPct * -maxTilt).toFixed(2);
    const tiltY = (xPct * maxTilt).toFixed(2);

    setTilt({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`,
      transition: "transform 0.05s ease-out",
    });
  };

  const handleMouseLeave = (setTilt: (style: React.CSSProperties) => void) => {
    setTilt({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.4s ease",
    });
  };

  const handleCopyUrl = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Could not copy link. Please copy manually.");
    }
  };

  return (
    <div className={`space-y-4 bg-slate-50/50 dark:bg-slate-950/10 border border-outline-variant/5 rounded-3xl p-6 transition-opacity duration-300 ${!card.active ? "opacity-60" : ""}`}>
      {/* Status row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{card.cardName}</span>
          <span className={`inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            card.active
              ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400"
              : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
          }`}>
            {card.active ? "Sharing On" : "Not Shared"}
          </span>
          {card.qrLink && (
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-indigo-500">
              <Link2 className="w-3 h-3" />
              Custom QR
            </span>
          )}
        </div>
      </div>

      {/* Public share URL */}
      {publicUrl && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-outline-variant/10">
          <Link2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 truncate flex-1 min-w-0">
            {publicUrl}
          </span>
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border border-outline-variant/10 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
          {card.active && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Open
            </a>
          )}
          {!card.active && (
            <span className="text-[9px] text-slate-400 italic">Activate to enable sharing</span>
          )}
        </div>
      )}

      <DigitalCardFaces
        card={card}
        username={profile.username || ""}
        socialLinks={profile.socialLinks}
        frontRef={frontRef}
        backRef={backRef}
        frontStyle={frontTilt}
        backStyle={backTilt}
        onFrontMouseMove={(e) => handleMouseMove(e, frontRef, setFrontTilt)}
        onBackMouseMove={(e) => handleMouseMove(e, backRef, setBackTilt)}
        onFrontMouseLeave={() => handleMouseLeave(setFrontTilt)}
        onBackMouseLeave={() => handleMouseLeave(setBackTilt)}
      />

      {/* Card Admin Controls */}
      <div className="flex flex-wrap gap-2 items-center justify-between pt-3 border-t border-outline-variant/5">
        {/* Left side: Active toggle + QR link indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleActive}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
              card.active
                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                : "bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-400"
            }`}
            title={card.active ? "Card is Active - Click to Deactivate" : "Card is Inactive - Click to Activate"}
          >
            {card.active
              ? <ToggleRight className="w-4 h-4" />
              : <ToggleLeft className="w-4 h-4" />}
            {card.active ? "Active" : "Inactive"}
          </button>

          {card.qrLink && (
            <a
              href={card.qrLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-all"
              title={`QR Embedded: ${card.qrLink}`}
            >
              <Link2 className="w-3.5 h-3.5" />
              QR Link
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Right side: Edit / Delete */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-4 py-2 border border-outline-variant/10 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-black transition-all text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Card
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 px-4 py-2 border border-rose-100 dark:border-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-xs font-black transition-all text-rose-500 hover:text-rose-600 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove Card
          </button>
        </div>
      </div>

    </div>
  );
}
