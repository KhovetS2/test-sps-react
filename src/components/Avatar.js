import React, { useMemo, useState } from "react";

/**
 * User avatar showing image when available, otherwise first letter of the name.
 * @param {string} name
 * @param {string | null} src
 * @param {"sm" | "md" | "lg"} size
 * @param {string} className
 */
function Avatar({ name, src = null, size = "md", className = "" }) {
  const [imageError, setImageError] = useState(false);

  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const initial = useMemo(() => {
    return name?.trim()?.charAt(0)?.toUpperCase() || "U";
  }, [name]);

  const shouldShowImage = !!src && !imageError;

  if (shouldShowImage) {
    return (
      <img
        src={src}
        alt={name || "User avatar"}
        onError={() => setImageError(true)}
        className={`rounded-full object-cover border border-gray-200 ${sizeMap[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`bg-sps-100 text-sps-700 rounded-full flex items-center justify-center font-semibold border border-gray-200 ${sizeMap[size]} ${className}`}
    >
      {initial}
    </div>
  );
}

export default Avatar;
