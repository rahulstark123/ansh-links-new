"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useProfileStore, ProductItem } from "@/store/useProfileStore";
import { X, Briefcase, Image as ImageIcon, UploadCloud, Trash2, Globe, Link as LinkIcon } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: ProductItem | null;
}

const CURRENCIES = [
  { value: "USD", symbol: "$", label: "USD ($)" },
  { value: "EUR", symbol: "€", label: "EUR (€)" },
  { value: "GBP", symbol: "£", label: "GBP (£)" },
  { value: "INR", symbol: "₹", label: "INR (₹)" },
  { value: "JPY", symbol: "¥", label: "JPY (¥)" },
];

export default function ProductModal({ isOpen, onClose, productToEdit }: ProductModalProps) {
  const { addProduct, updateProduct } = useProfileStore();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [active, setActive] = useState(true);
  
  const [isDragOver, setIsDragOver] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      
      const cleanPrice = productToEdit.price.replace(/[$\u20AC\u00A3\u20B9\u00A5]/g, "");
      setPrice(cleanPrice);
      
      setCurrency(productToEdit.currency || "USD");
      setImageUrl(productToEdit.imageUrl || "");
      setLinkUrl(productToEdit.linkUrl || "");
      setActive(productToEdit.active);
    } else {
      setName("");
      setPrice("");
      setCurrency("USD");
      setImageUrl("");
      setLinkUrl("");
      setActive(true);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSave = () => {
    if (!name.trim() || !price.trim()) return;

    addProductOrUpdate();
  };

  const addProductOrUpdate = () => {
    const productData = {
      name: name.trim(),
      price: price.trim(),
      currency,
      imageUrl: imageUrl.trim() || undefined,
      linkUrl: linkUrl.trim() || undefined,
      active,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, productData);
    } else {
      addProduct(productData);
    }
    onClose();
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      
      {/* Modal Card */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300">
        
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-outline-variant/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg primary-gradient flex items-center justify-center text-white">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-black tracking-tight font-sans">
              {productToEdit ? "Modify Store Product" : "Publish Store Product"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          
          {/* Product Name */}
          <div>
            <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5 font-sans">
              Product Name / Title
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="premium-input-large font-sans"
              placeholder="e.g. Minimalist Resume template"
              required
            />
          </div>

          {/* Pricing Input Group */}
          <div>
            <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5 font-sans">
              Pricing Details
            </label>
            <div className="flex rounded-2xl border border-outline-variant/10 overflow-hidden bg-slate-50 dark:bg-slate-950/20 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/5 transition-all">
              
              <div className="relative border-r border-outline-variant/10 bg-white dark:bg-slate-900 shrink-0">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-full pl-4 pr-9 py-3 bg-transparent text-xs font-black focus:outline-none cursor-pointer appearance-none text-slate-700 dark:text-slate-200"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value} className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200">
                      {c.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <ChevronDown className="w-3.5 h-3.5" />
                </span>
              </div>

              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4.5 py-3 bg-transparent text-xs font-black focus:outline-none"
                placeholder="19.00"
                required
              />
            </div>
          </div>

          {/* Product Redirect Link (Optional) */}
          <div>
            <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5 font-sans">
              Product Redirect URL (Optional)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400">
                <LinkIcon className="w-4 h-4" />
              </span>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="premium-input-large text-xs pl-10 font-sans"
                placeholder="https://yourstore.com/checkout/template"
              />
            </div>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5 font-sans">
              Product Image Upload
            </label>
            
            {imageUrl ? (
              <div className="relative border border-outline-variant/10 rounded-2xl aspect-[1.7/1] overflow-hidden group shadow-sm bg-slate-50 dark:bg-slate-950/20 flex items-center justify-center">
                <img src={imageUrl} alt="Uploaded product" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setImageUrl("")}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-outline-variant/10 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center justify-center text-slate-500 hover:text-rose-600 transition-colors shadow-md cursor-pointer"
                    title="Remove Product Image"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => document.getElementById("product-file-input")?.click()}
                className={`border-2 border-dashed rounded-2xl aspect-[1.7/1] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400"
                    : "border-outline-variant/15 hover:border-indigo-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 text-slate-400 hover:text-slate-600"
                }`}
              >
                <input
                  id="product-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <UploadCloud className="w-10 h-10 mb-3 text-indigo-500/80 animate-pulse" />
                <span className="text-xs font-black block">Drag & drop product image here</span>
                <span className="text-[10px] font-bold block mt-1 text-slate-400/80">Supports PNG, JPG, WebP. Max 3MB</span>
              </div>
            )}
          </div>

          {/* Active status */}
          <div className="flex items-center justify-between p-4.5 bg-slate-50 dark:bg-slate-950/45 border border-outline-variant/10 rounded-2xl">
            <span className="text-xs font-black font-sans">Product Active in Shop</span>
            <button
              onClick={() => setActive(!active)}
              className={`w-12 h-6.5 rounded-full p-1.5 transition-all cursor-pointer shrink-0 ${
                active ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-all ${
                  active ? "translate-x-5.5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="h-20 flex items-center justify-end px-6 gap-3 border-t border-outline-variant/5 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-outline-variant/10 hover:bg-slate-100 text-xs font-bold font-sans transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || !price.trim()}
            className="px-6 py-2.5 rounded-xl text-white primary-gradient text-xs font-bold font-sans shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform disabled:opacity-50 disabled:pointer-events-none"
          >
            Save Product
          </button>
        </div>

      </div>

    </div>,
    document.body
  );
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
