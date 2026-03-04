import React from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import DeleteConfirm from "./DeleteConfirm";

function UserRow({ user, currentUser, isDeleting, onDeleteRequest, onDeleteConfirm, onDeleteCancel }) {
    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4 text-sm text-gray-500 font-mono">#{user.id}</td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <Avatar name={user.name} size="sm" />
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
            <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sps-100 text-sps-700">
                    {user.type}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <Link
                        to={`/users/${user.id}`}
                        className="text-sps-600 hover:text-sps-700 p-1.5 rounded-lg hover:bg-sps-50 transition-colors"
                        title="Editar"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </Link>
                    {user.id !== currentUser?.id && (
                        isDeleting ? (
                            <DeleteConfirm onConfirm={onDeleteConfirm} onCancel={onDeleteCancel} />
                        ) : (
                            <button
                                onClick={onDeleteRequest}
                                className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                title="Deletar"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )
                    )}
                </div>
            </td>
        </tr>
    );
}

export default UserRow;
