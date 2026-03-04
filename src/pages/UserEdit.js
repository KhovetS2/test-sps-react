import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../services/UserService";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";
import PageHeader from "../components/PageHeader";
import FormField from "../components/FormField";

function UserEdit() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const isNew = userId === "new";

  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "user",
    password: "",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isNew) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const user = await userService.get(userId);
      setForm({
        name: user.name || "",
        email: user.email || "",
        type: user.type || "user",
        password: "",
      });
    } catch (err) {
      setError("Erro ao carregar usuário.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      if (isNew) {
        await userService.create(form);
        setSuccess("Usuário criado com sucesso!");
        setTimeout(() => navigate("/users"), 1500);
      } else {
        const data = { ...form };
        if (!data.password) delete data.password;
        await userService.update(userId, data);
        setSuccess("Usuário atualizado com sucesso!");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Erro ao salvar usuário.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title={isNew ? "Novo Usuário" : "Editar Usuário"}
        subtitle={isNew ? "Preencha os dados para criar um novo usuário" : `Editando usuário #${userId}`}
        backTo="/users"
      />

      <Alert variant="error" message={error} />
      <Alert variant="success" message={success} />

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Nome" htmlFor="name">
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Nome do usuário"
            />
          </FormField>

          <FormField label="E-mail" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="usuario@email.com"
            />
          </FormField>

          <FormField label="Tipo" htmlFor="type">
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="input-field"
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
              <option value="manager">Gerente</option>
            </select>
          </FormField>

          <FormField
            label="Senha"
            htmlFor="password"
            hint={!isNew ? "(deixe vazio para manter)" : undefined}
          >
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required={isNew}
              className="input-field"
              placeholder={isNew ? "Senha do usuário" : "••••••••"}
            />
          </FormField>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isNew ? "Criar Usuário" : "Salvar Alterações"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="btn-ghost"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserEdit;
