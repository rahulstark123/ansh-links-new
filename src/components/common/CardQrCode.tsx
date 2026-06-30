"use client";

import QRCode from "react-qr-code";

interface CardQrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export default function CardQrCode({ value, size = 56, className = "" }: CardQrCodeProps) {
  if (!value) return null;

  return (
    <div className={`bg-white p-1.5 rounded-md ${className}`}>
      <QRCode
        value={value}
        size={size}
        style={{ height: "auto", maxWidth: "100%", width: "100%", display: "block" }}
        viewBox={`0 0 256 256`}
      />
    </div>
  );
}
