import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import userService from "../services/UserService";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";
import PageHeader from "../components/PageHeader";
import Avatar from "../components/Avatar";
import DeleteConfirm from "../components/DeleteConfirm";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.list();
      setUsers(data);
    } catch (err) {
      setError("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await userService.delete(id);
      setUsers(users.filter((u) => u.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError("Erro ao deletar usuário.");
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando usuários..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuários"
        subtitle={`${users.length} usuário${users.length !== 1 ? "s" : ""} cadastrado${users.length !== 1 ? "s" : ""}`}
        action={
          <Link to="/users/new" className="btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Novo Usuário
          </Link>
        }
      />

      <Alert variant="error" message={error} onClose={() => setError("")} />

      {/* Users Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Nome</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">E-mail</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Tipo</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isDeleting={deleteConfirm === user.id}
                  onDeleteRequest={() => setDeleteConfirm(user.id)}
                  onDeleteConfirm={() => handleDelete(user.id)}
                  onDeleteCancel={() => setDeleteConfirm(null)}
                />
              ))}
              {users.length === 0 && <EmptyRow />}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UserRow({ user, isDeleting, onDeleteRequest, onDeleteConfirm, onDeleteCancel }) {
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
          {isDeleting ? (
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
          )}
        </div>
      </td>
    </tr>
  );
}

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

export default Users;
