import React from "react";

/**
 * Reusable loading spinner component.
 * @param {string} message - Optional message to display below the spinner
 * @param {boolean} fullPage - If true, centers in the full viewport; otherwise uses padding
 * @param {string} className - Additional CSS classes
 */
function LoadingSpinner({ message = "Carregando...", fullPage = false, className = "" }) {
    const containerClass = fullPage
        ? "min-h-screen flex items-center justify-center bg-gray-50"
        : "flex items-center justify-center py-20";

    return (
        <div className={`${containerClass} ${className}`}>
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-sps-200 border-t-sps-600 rounded-full animate-spin" />
                <p className="text-gray-500 font-medium">{message}</p>
            </div>
        </div>
    );
}

export default LoadingSpinner;
