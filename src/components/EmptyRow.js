import React from "react";

function EmptyRow() {
    return (
        <tr>
            <td colSpan={5} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-2">
                    <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="text-gray-500 font-medium">Nenhum usuário encontrado</p>
                </div>
            </td>
        </tr>
    );
}

export default EmptyRow;
