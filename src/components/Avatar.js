import React from "react";

/**
 * User avatar circle showing the first letter of the name.
 * @param {string} name - User name (uses first character)
 * @param {"sm" | "md" | "lg"} size - Avatar size
 * @param {string} className - Additional CSS classes
 */
function Avatar({ name, size = "md", className = "" }) {
    const sizeMap = {
        sm: "w-8 h-8 text-xs",
        md: "w-9 h-9 text-sm",
        lg: "w-12 h-12 text-base",
    };

    const initial = name?.charAt(0)?.toUpperCase() || "U";

    return (
        <div
            className={`bg-sps-100 text-sps-700 rounded-full flex items-center justify-center font-semibold ${sizeMap[size]} ${className}`}
        >
            {initial}
        </div>
    );
}

export default Avatar;
