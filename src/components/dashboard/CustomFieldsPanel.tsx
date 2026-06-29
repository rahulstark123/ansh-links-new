"use client";

import { useProfileStore, CustomField } from "@/store/useProfileStore";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { Link2, Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export interface CustomFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fieldData: Omit<CustomField, "id">) => void;
  fieldToEdit?: CustomField | null;
}

export function CustomFieldModal({ isOpen, onClose, onSave, fieldToEdit }: CustomFieldModalProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (fieldToEdit) {
      setKey(fieldToEdit.key);
      setValue(fieldToEdit.value);
    } else {
      setKey("");
      setValue("");
    }
  }, [fieldToEdit, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSave = () => {
    if (!key.trim() || !value.trim()) return;

    onSave({
      key: key.trim(),
      value: value.trim(),
      active: fieldToEdit ? fieldToEdit.active : false,
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl p-4 animate-fadeIn font-sans">
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-outline-variant/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-650 dark:text-indigo-400">
              <Link2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black tracking-tight">{fieldToEdit ? "Edit Custom Field" : "Create Custom Field"}</h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-black tracking-wider text-slate-500 block mb-1.5">
              Field Label / Title
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="premium-input-large text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold"
              placeholder="e.g. Current Location, College, Favorite Quote"
            />
          </div>

          <div>
            <label className="text-xs font-black tracking-wider text-slate-500 block mb-1.5">
              Field Value
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="premium-input-large text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold"
              placeholder="e.g. Mumbai, IIT Bombay, Stay Hungry"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="h-20 flex items-center justify-end px-6 gap-3 border-t border-outline-variant/5 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-outline-variant/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!key.trim() || !value.trim()}
            className="px-6 py-2.5 rounded-xl text-white primary-gradient text-xs font-bold shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Field
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function CustomFieldsPanel() {
  const { profile, updateProfileInfo } = useProfileStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingField, setDeletingField] = useState<CustomField | null>(null);

  const fields = profile.customFields || [];

  const handleOpenCreate = () => {
    setEditingField(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (field: CustomField) => {
    setEditingField(field);
    setModalOpen(true);
  };

  const handleOpenDelete = (field: CustomField) => {
    setDeletingField(field);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingField) {
      const updated = fields.filter((l) => l.id !== deletingField.id);
      updateProfileInfo({ customFields: updated });
      setDeletingField(null);
      setTimeout(() => {
        useProfileStore.getState().syncWithCloud();
      }, 100);
    }
  };

  const handleSaveField = (fieldData: Omit<CustomField, "id">) => {
    let updated = [...fields];

    if (editingField) {
      updated = updated.map((l) =>
        l.id === editingField.id ? { ...l, ...fieldData } : l
      );
    } else {
      updated.push({
        id: `field-${Date.now()}`,
        ...fieldData,
      });
    }

    updateProfileInfo({ customFields: updated });
    setTimeout(() => {
      useProfileStore.getState().syncWithCloud();
    }, 100);
  };

  const handleToggleActive = (field: CustomField) => {
    const updated = fields.map((l) =>
      l.id === field.id ? { ...l, active: !l.active } : l
    );
    updateProfileInfo({ customFields: updated });
    setTimeout(() => {
      useProfileStore.getState().syncWithCloud();
    }, 100);
  };

  return (
    <div className="p-8 sm:p-10 space-y-8 w-full animate-fadeIn font-sans">
      {/* Header Block */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-colors duration-300">
        <div className="space-y-2">
          <h3 className="font-black text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
            <Link2 className="w-5.5 h-5.5" />
            Custom Fields Setup
          </h3>
          <p className="text-sm text-slate-400">
            Create and manage custom key-value text lines to display on your landing page. Feature them inside the sandbox canvas.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white primary-gradient text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform cursor-pointer shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          Add Custom Field
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div
            key={field.id}
            className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Link2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black block truncate">{field.key}</span>
                  <button
                    onClick={() => handleToggleActive(field)}
                    className="shrink-0"
                    title={field.active ? "Hide from landing page" : "Show on landing page"}
                  >
                    {field.active ? (
                      <Eye className="w-3.5 h-3.5 text-emerald-500 hover:text-emerald-600" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-400 hover:text-slate-500" />
                    )}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 font-bold block truncate mt-0.5">{field.value}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1 shrink-0 ml-4">
              <button
                onClick={() => handleOpenEdit(field)}
                className="w-8 h-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-650 transition-colors cursor-pointer"
                title="Modify Field"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleOpenDelete(field)}
                className="w-8 h-8 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-955/20 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Remove Field"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="col-span-full text-center py-24 bg-white dark:bg-slate-900 border border-dashed border-outline-variant/10 rounded-3xl p-8 text-slate-400 space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-300">
              <Link2 className="w-7 h-7" />
            </div>
            <p className="text-base font-bold">No custom fields created</p>
            <p className="text-xs">Select "Add Custom Field" above to configure your first key-value line.</p>
          </div>
        )}
      </div>

      <CustomFieldModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveField}
        fieldToEdit={editingField}
      />

      <DeleteConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={`"${deletingField?.key}" field`}
      />
    </div>
  );
}
