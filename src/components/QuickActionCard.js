import React from "react";
import { Link } from "react-router-dom";

const colorMap = {
    sps: "bg-sps-50 text-sps-600 group-hover:bg-sps-100",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
    amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
};

/**
 * Dashboard action card with icon, title, description, and optional link.
 * @param {string} title - Card title
 * @param {string} description - Card description
 * @param {React.ReactNode} icon - Icon element
 * @param {string} href - Link destination (internal or external)
 * @param {boolean} external - If true, opens in new tab
 * @param {string} color - Color theme: "sps" | "emerald" | "amber"
 */
function QuickActionCard({ title, description, icon, href, external, color = "sps" }) {
    const content = (
        <div className="card group hover:shadow-md transition-all duration-200 cursor-pointer h-full">
            <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${colorMap[color]}`}
            >
                {icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );

    if (external) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        );
    }

    if (href) {
        return <Link to={href}>{content}</Link>;
    }

    return content;
}

export default QuickActionCard;
