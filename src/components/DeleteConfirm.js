import React from "react";

/**
 * Inline delete confirmation with Yes/No buttons.
 * @param {function} onConfirm - Handler for confirming deletion
 * @param {function} onCancel - Handler for canceling deletion
 */
function DeleteConfirm({ onConfirm, onCancel }) {
    return (
        <div className="flex items-center gap-1">
            <button
                onClick={onConfirm}
                className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
                Sim
            </button>
            <button
                onClick={onCancel}
                className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
                Não
            </button>
        </div>
    );
}

export default DeleteConfirm;
