import { CustomField } from "@/store/useProfileStore";

export function isCustomFieldActive(field: CustomField): boolean {
  return field.active === true;
}

export async function fetchCustomFields(wid: number): Promise<CustomField[]> {
  const res = await fetch(`/api/custom-fields?wid=${wid}`);
  if (!res.ok) throw new Error("Failed to load custom fields");
  return res.json();
}

export async function createCustomField(
  wid: number,
  data: Omit<CustomField, "id">
): Promise<CustomField> {
  const res = await fetch("/api/custom-fields", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wid, ...data }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create custom field");
  }
  return res.json();
}

export async function updateCustomField(
  id: string,
  wid: number,
  data: Partial<Omit<CustomField, "id">>
): Promise<CustomField> {
  const res = await fetch(`/api/custom-fields/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wid, ...data }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update custom field");
  }
  return res.json();
}

export async function deleteCustomField(id: string): Promise<void> {
  const res = await fetch(`/api/custom-fields/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete custom field");
  }
}
