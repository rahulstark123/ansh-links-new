"use client";

import { useState } from "react";
import { useProfileStore, ProductItem } from "@/store/useProfileStore";
import ProductModal from "@/components/dashboard/ProductModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { Plus, Briefcase, Edit2, Trash2, Tag, Eye, Link as LinkIcon } from "lucide-react";

export default function ProductsPanel() {
  const { profile, removeProduct, updateProduct } = useProfileStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Custom delete confirmation states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const productsList = profile.products || [];

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product: ProductItem) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleToggleActive = async (product: ProductItem) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !product.active }),
      });
      if (!res.ok) throw new Error("Failed to toggle product status");
      const updated = await res.json();
      updateProduct(product.id, updated);
      showToast(updated.active ? "Product activated!" : "Product set to draft!", "success");
    } catch (err) {
      console.error(err);
      showToast("Error updating product: " + (err as Error).message, "error");
    }
  };

  const handleOpenDelete = (product: ProductItem) => {
    setDeletingProduct(product);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingProduct) {
      try {
        const res = await fetch(`/api/products/${deletingProduct.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete product");
        removeProduct(deletingProduct.id);
        setDeletingProduct(null);
        showToast("Product deleted successfully!", "success");
      } catch (err) {
        console.error(err);
        showToast("Error deleting product: " + (err as Error).message, "error");
      }
    }
  };

  return (
    <div className="p-8 sm:p-10 space-y-8 w-full animate-fadeIn font-sans">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-8 shadow-sm transition-colors duration-300">
        <div className="space-y-2">
          <h3 className="font-black text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
            <Briefcase className="w-5.5 h-5.5" />
            Digital Products Store
          </h3>
          <p className="text-sm text-slate-400">
            Showcase e-books, resume templates, and software licenses directly on your profile.
          </p>
        </div>
        
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white primary-gradient text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform cursor-pointer shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          Publish Product
        </button>
      </div>

      {/* Grid products list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productsList.map((product) => (
          <div
            key={product.id}
            className={`bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group ${
              !product.active && "opacity-60"
            }`}
          >
            {/* Image Cover */}
            <div className="aspect-[1.5/1] bg-slate-50 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-outline-variant/5">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
              ) : (
                <div className="text-slate-300 dark:text-slate-700 flex flex-col items-center gap-2">
                  <Briefcase className="w-10 h-10" />
                  <span className="text-[10px] uppercase font-black tracking-wider">No Product image</span>
                </div>
              )}

              {/* Status Badge */}
              <button
                onClick={() => handleToggleActive(product)}
                className={`absolute top-4 left-4 px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer shadow-sm ${
                  product.active
                    ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}
              >
                {product.active ? "Active" : "Draft"}
              </button>

              {/* Price Tag Overlay */}
              <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow-md">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-black">
                  {(() => {
                    const cleanPrice = product.price.replace(/[$\u20AC\u00A3\u20B9\u00A5]/g, "");
                    let symbol = "$";
                    if (product.currency === "EUR") symbol = "€";
                    else if (product.currency === "GBP") symbol = "£";
                    else if (product.currency === "INR") symbol = "₹";
                    else if (product.currency === "JPY") symbol = "¥";
                    return `${symbol}${cleanPrice}`;
                  })()}
                </span>
              </div>
            </div>

            {/* Product description / actions */}
            <div className="p-5 flex-grow flex flex-col justify-between gap-5">
              <div className="space-y-1">
                <h4 className="text-sm font-black line-clamp-1">{product.name}</h4>
                <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{Math.floor(Math.random() * 80) + 5} shop views</span>
                </p>
              </div>

              {/* Admin Actions */}
              <div className="flex gap-2 pt-3.5 border-t border-outline-variant/5 justify-end items-center">
                {product.linkUrl && (
                  <a
                    href={product.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                    title="Visit redirect link"
                  >
                    <LinkIcon className="w-4.5 h-4.5" />
                  </a>
                )}
                <button
                  onClick={() => handleOpenEdit(product)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                  title="Modify product"
                >
                  <Edit2 className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => handleOpenDelete(product)}
                  className="w-8 h-8 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove product"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

          </div>
        ))}

        {productsList.length === 0 && (
          <div className="col-span-full text-center py-24 bg-white dark:bg-slate-900 border border-dashed border-outline-variant/10 rounded-3xl p-8 text-slate-400 space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-300">
              <Briefcase className="w-7 h-7" />
            </div>
            <p className="text-base font-bold">No store products found</p>
            <p className="text-xs">Select "Publish Product" to offer your digital templates or assets here.</p>
          </div>
        )}
      </div>

      {/* Product Creator/Editor overlay */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productToEdit={editingProduct}
        showToast={showToast}
      />

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={deletingProduct?.name}
      />

      {/* Custom Toast Notification Overlay */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1050] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-white dark:bg-slate-900 border-outline-variant/10 animate-slideDown font-bold text-xs select-none">
          <div className={`w-2.5 h-2.5 rounded-full ${toast.type === "success" ? "bg-emerald-500 shadow-sm" : "bg-rose-500 shadow-sm"}`} />
          <span className="text-slate-800 dark:text-slate-200">{toast.message}</span>
        </div>
      )}

    </div>
  );
}
