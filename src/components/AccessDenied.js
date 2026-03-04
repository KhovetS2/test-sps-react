import React from "react";

/**
 * 403 Access Denied page displayed when user lacks permissions.
 * @param {function} onBack - Handler for the back button
 * @param {function} onLogout - Handler for the logout button
 */
function AccessDenied({ onBack, onLogout }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="card max-w-md w-full mx-4 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
                <p className="text-gray-500 mb-6">
                    Você não tem permissão para acessar esta página.
                </p>
                <button onClick={onBack} className="btn-primary mr-2">
                    Voltar
                </button>
                <button onClick={onLogout} className="btn-ghost">
                    Sair
                </button>
            </div>
        </div>
    );
}

export default AccessDenied;
