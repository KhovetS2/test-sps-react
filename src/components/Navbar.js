import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "./Avatar";
import NavLink from "./NavLink";

/**
 * Application navigation bar with logo, nav links, user info, and logout.
 */
function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Brand */}
                    <div className="flex items-center gap-8">
                        <a href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-sps-500 to-sps-700 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">S</span>
                            </div>
                            <span className="font-bold text-lg text-gray-900">SPS</span>
                        </a>

                        {/* Nav Links */}
                        <div className="hidden sm:flex items-center gap-1">
                            <NavLink href="/" current={location.pathname === "/"}>
                                Home
                            </NavLink>
                            <NavLink href="/users" current={location.pathname.startsWith("/users")}>
                                Usuários
                            </NavLink>
                        </div>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.type}</p>
                        </div>
                        <Avatar name={user?.name} />
                        <button
                            onClick={logout}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                            title="Sair"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
