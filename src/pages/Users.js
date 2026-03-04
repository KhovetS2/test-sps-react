import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import userService from "../services/UserService";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";
import PageHeader from "../components/PageHeader";
import UserRow from "../components/UserRow";
import EmptyRow from "../components/EmptyRow";

function Users() {
  const { user: currentUser } = useAuth();
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
                  currentUser={currentUser}
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

export default Users;
