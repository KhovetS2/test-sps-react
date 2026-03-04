import React from "react";

/**
 * Navigation link styled with active state.
 * @param {string} href - Link destination
 * @param {boolean} current - Whether this is the active route
 * @param {React.ReactNode} children - Link text
 */
function NavLink({ href, current, children }) {
    return (
        <a
            href={href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${current
                    ? "bg-sps-50 text-sps-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
        >
            {children}
        </a>
    );
}

export default NavLink;
