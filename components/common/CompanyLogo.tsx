"use client";

import { useState } from "react";

interface CompanyLogoProps {
  src?: string;
  companyName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-20 h-20",
};

const placeholderSizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-xs",
  lg: "w-12 h-12 text-sm",
};

export function CompanyLogo({
  src,
  companyName,
  size = "md",
  className = "",
}: CompanyLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!src);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Get company initials for fallback
  const getCompanyInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-neutral-50 dark:bg-neutral-700 rounded-lg flex items-center justify-center overflow-hidden relative ${className}`}
    >
      {src && !imageError ? (
        <>
          {imageLoading && (
            <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-600 animate-pulse rounded-lg"></div>
          )}
          <img
            src={src}
            alt={`${companyName} logo`}
            className="w-full h-full object-contain rounded-lg"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: imageError ? "none" : "block" }}
          />
        </>
      ) : (
        <div
          className={`${placeholderSizeClasses[size]} bg-neutral-100 dark:bg-neutral-600 rounded flex items-center justify-center`}
        >
          <span className="text-neutral-500 dark:text-neutral-400 font-semibold">
            {getCompanyInitials(companyName)}
          </span>
        </div>
      )}
    </div>
  );
}
