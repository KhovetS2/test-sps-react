import React from "react";

const icons = {
    error: (
        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    success: (
        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
};

/**
 * Reusable alert component for error and success messages.
 * @param {"error" | "success"} variant - Alert style variant
 * @param {string} message - Message to display
 * @param {function} onClose - Optional close handler
 */
function Alert({ variant = "error", message, onClose }) {
    if (!message) return null;

    return (
        <div className={`border rounded-lg p-4 flex items-center gap-3 ${styles[variant]}`}>
            {icons[variant]}
            <p className="text-sm">{message}</p>
            {onClose && (
                <button onClick={onClose} className="ml-auto opacity-60 hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}

export default Alert;
