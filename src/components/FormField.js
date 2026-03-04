import React from "react";

/**
 * Reusable form field wrapper with label.
 * Supports input, select, and any child content.
 *
 * @param {string} label - Field label text
 * @param {string} htmlFor - HTML id for the label's for attribute
 * @param {React.ReactNode} hint - Optional hint text after the label
 * @param {React.ReactNode} children - Input element(s)
 */
function FormField({ label, htmlFor, hint, children }) {
    return (
        <div>
            <label
                htmlFor={htmlFor}
                className="block text-sm font-medium text-gray-700 mb-1.5"
            >
                {label}
                {hint && (
                    <span className="text-gray-400 font-normal ml-1">{hint}</span>
                )}
            </label>
            {children}
        </div>
    );
}

export default FormField;
