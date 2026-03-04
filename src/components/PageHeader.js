import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Reusable page header with optional back button, title, subtitle, and action slot.
 * @param {string} title - Page title
 * @param {string} subtitle - Optional subtitle text
 * @param {string} backTo - Optional path for back navigation
 * @param {React.ReactNode} action - Optional action element (e.g. buttons) for the right side
 */
function PageHeader({ title, subtitle, backTo, action }) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                {backTo && (
                    <button
                        onClick={() => navigate(backTo)}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    {subtitle && <p className="text-gray-500 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

export default PageHeader;
