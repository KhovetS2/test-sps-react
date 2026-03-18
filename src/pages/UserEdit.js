import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userService from "../services/UserService";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";
import PageHeader from "../components/PageHeader";
import Avatar from "../components/Avatar";

function EditUser() {
  const params = useParams();
  const id = params.userId;
  const isCreateMode = id === "new";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!isCreateMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "user",
    password: "",
  });

  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [serverImageUrl, setServerImageUrl] = useState("");

  useEffect(() => {
    if (isCreateMode) {
      setLoading(false);
      return;
    }

    if (!id) {
      setError("ID do usuário não encontrado na rota.");
      setLoading(false);
      return;
    }

    fetchUser();
  }, [id, isCreateMode]);

  useEffect(() => {
    loadServerImage();

    return () => {
      if (serverImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(serverImageUrl);
      }
    };
  }, [user?.id, user?.updated_at]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function loadServerImage() {
    if (!user?.id || !user?.has_profile_image) {
      if (serverImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(serverImageUrl);
      }
      setServerImageUrl("");
      return;
    }

    try {
      const objectUrl = await userService.getProfileImageObjectUrl(user);

      setServerImageUrl((prev) => {
        if (prev?.startsWith("blob:")) {
          URL.revokeObjectURL(prev);
        }
        return objectUrl || "";
      });
    } catch (err) {
      console.error("Erro ao carregar imagem autenticada =>", err);
      setServerImageUrl((prev) => {
        if (prev?.startsWith("blob:")) {
          URL.revokeObjectURL(prev);
        }
        return "";
      });
    }
  }

  const currentImageSrc = useMemo(() => {
    if (previewUrl) return previewUrl;
    if (serverImageUrl) return serverImageUrl;
    return null;
  }, [previewUrl, serverImageUrl]);

  async function fetchUser() {
    try {
      setLoading(true);
      setError("");

      const response = await userService.get(id);
      const userData = response?.user ?? response;

      if (!userData) {
        throw new Error("Usuário não encontrado no retorno da API.");
      }

      setUser(userData);
      setForm({
        name: userData.name || "",
        email: userData.email || "",
        type: userData.type || "user",
        password: "",
      });
    } catch (err) {
      console.error("fetchUser error =>", err);
      setError("Erro ao carregar usuário.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);

    setPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return file ? URL.createObjectURL(file) : "";
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: form.name,
        email: form.email,
        type: form.type,
      };

      if (form.password?.trim()) {
        payload.password = form.password;
      }

      let savedUser = null;

      if (isCreateMode) {
        if (!payload.password) {
          setError("Senha é obrigatória na criação do usuário.");
          setSaving(false);
          return;
        }

        const createResponse = await userService.create(payload);
        savedUser = createResponse?.user ?? createResponse;
      } else {
        const updateResponse = await userService.update(id, payload);
        savedUser = updateResponse?.user ?? updateResponse;
      }

      if (!savedUser?.id) {
        throw new Error("Usuário salvo, mas o ID não foi retornado.");
      }

      if (selectedImage) {
        const uploadResponse = await userService.uploadProfileImage(
          savedUser.id,
          selectedImage,
        );
        savedUser = uploadResponse?.user ?? uploadResponse;
      }

      setUser(savedUser);
      setSelectedImage(null);

      setPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) {
          URL.revokeObjectURL(prev);
        }
        return "";
      });

      setForm((prev) => ({
        ...prev,
        password: "",
      }));

      navigate("/users", {
        replace: true,
        state: {
          success: isCreateMode
            ? "Usuário criado com sucesso."
            : "Usuário atualizado com sucesso.",
        },
      });
    } catch (err) {
      console.error("save user error =>", err);
      const apiMessage =
        err?.response?.data?.message || "Erro ao salvar usuário.";
      setError(apiMessage);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Carregando usuário..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isCreateMode ? "Criar Usuário" : "Editar Usuário"}
        subtitle={
          isCreateMode
            ? "Cadastre um novo usuário"
            : user
              ? `Editando ${user.name}`
              : "Editar usuário"
        }
      />

      <Alert variant="error" message={error} onClose={() => setError("")} />
      <Alert
        variant="success"
        message={success}
        onClose={() => setSuccess("")}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Foto de perfil
          </h2>

          <div className="flex justify-center">
            <Avatar
              name={form.name}
              src={currentImageSrc}
              size="lg"
              className="w-24 h-24 text-2xl"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Selecionar imagem
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            />
          </div>

          {selectedImage && (
            <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
              <div>
                <strong>Arquivo:</strong> {selectedImage.name}
              </div>
              <div>
                <strong>Tamanho:</strong>{" "}
                {(selectedImage.size / 1024).toFixed(2)} KB
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500">
            A foto será salva junto com o cadastro/edição do usuário.
          </p>
        </div>

        <div className="card p-6 lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isCreateMode ? "Senha" : "Nova senha"}
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder={
                  isCreateMode
                    ? "Digite a senha"
                    : "Deixe em branco para manter a atual"
                }
                required={isCreateMode}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving
                  ? isCreateMode
                    ? "Criando..."
                    : "Salvando..."
                  : isCreateMode
                    ? "Criar usuário"
                    : "Salvar alterações"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/users")}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
