import React from "react";

/**
 * Small info item displaying a label-value pair in a subtle card.
 * @param {string} label - Label text (displayed uppercase)
 * @param {string} value - Value to display
 */
function InfoItem({ label, value }) {
    return (
        <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                {label}
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
                {value || "—"}
            </p>
        </div>
    );
}

export default InfoItem;
