import { DigitalCard } from "@/store/useProfileStore";

export async function fetchCards(wid: number): Promise<DigitalCard[]> {
  const res = await fetch(`/api/cards?wid=${wid}`);
  if (!res.ok) throw new Error("Failed to load digital cards");
  return res.json();
}

export async function createCard(
  wid: number,
  data: Omit<DigitalCard, "id">
): Promise<DigitalCard> {
  const res = await fetch("/api/cards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wid, ...data }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create card");
  }
  return res.json();
}

export async function updateCardApi(
  id: string,
  wid: number,
  data: Partial<Omit<DigitalCard, "id">>
): Promise<DigitalCard> {
  const res = await fetch(`/api/cards/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wid, ...data }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update card");
  }
  return res.json();
}

export async function deleteCard(id: string): Promise<void> {
  const res = await fetch(`/api/cards/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete card");
  }
}
