import React, { useEffect, useMemo, useState } from "react";
import fileService from "../services/FileService";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";
import PageHeader from "../components/PageHeader";

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "-";
  if (bytes === 0) return "0 B";

  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2)} ${sizes[i]}`;
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("pt-BR");
}

function getPreviewType(mimetype = "", filename = "") {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype === "application/pdf") return "pdf";
  if (mimetype.startsWith("text/")) return "text";

  const lower = filename.toLowerCase();
  if (
    lower.endsWith(".txt") ||
    lower.endsWith(".json") ||
    lower.endsWith(".csv") ||
    lower.endsWith(".md")
  ) {
    return "text";
  }

  return "unsupported";
}

function Arquivos() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const totalFilesText = useMemo(() => {
    return `${files.length} arquivo${files.length !== 1 ? "s" : ""} cadastrado${files.length !== 1 ? "s" : ""}`;
  }, [files]);

  async function fetchFiles() {
    try {
      setLoading(true);
      setError("");
      const data = await fileService.list();
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Erro ao carregar arquivos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Selecione um arquivo para enviar.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      await fileService.upload(selectedFile);

      setSuccess("Arquivo enviado com sucesso.");
      setSelectedFile(null);

      const input = document.getElementById("file-input");
      if (input) input.value = "";

      await fetchFiles();
    } catch (err) {
      setError("Erro ao enviar arquivo.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(file) {
    try {
      setError("");

      const blob = await fileService.download(file.id);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.filename || `arquivo-${file.id}`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Erro ao baixar arquivo.");
    }
  }

  async function handlePreview(file) {
    try {
      setPreviewLoading(true);
      setPreviewError("");
      setPreviewOpen(true);
      setPreviewFile(file);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }

      const blob = await fileService.download(file.id);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      setPreviewError("Erro ao carregar visualização do arquivo.");
    } finally {
      setPreviewLoading(false);
    }
  }

  function closePreview() {
    setPreviewOpen(false);
    setPreviewError("");
    setPreviewFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  }

  const previewType = previewFile
    ? getPreviewType(previewFile.mimetype, previewFile.filename)
    : "unsupported";

  if (loading) {
    return <LoadingSpinner message="Carregando arquivos..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Arquivos" subtitle={totalFilesText} />

      <Alert variant="error" message={error} onClose={() => setError("")} />
      <Alert
        variant="success"
        message={success}
        onClose={() => setSuccess("")}
      />

      <div className="card p-6">
        <form
          onSubmit={handleUpload}
          className="flex flex-col gap-4 md:flex-row md:items-end"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar arquivo
            </label>
            <input
              id="file-input"
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Enviando..." : "Enviar arquivo"}
          </button>
        </form>

        {selectedFile && (
          <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
            <strong>Arquivo selecionado:</strong> {selectedFile.name} (
            {formatBytes(selectedFile.size)})
          </div>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  ID
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Nome
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Tipo
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Tamanho
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Criado em
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50/60">
                  <td className="px-6 py-4 text-sm text-gray-700">{file.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {file.filename}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {file.mimetype}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatBytes(file.size)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatDate(file.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handlePreview(file)}
                        className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                      >
                        Visualizar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload(file)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Baixar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {files.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    Nenhum arquivo cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Visualizar arquivo
                </h2>
                <p className="text-sm text-gray-500">
                  {previewFile?.filename || "-"}
                </p>
              </div>

              <button
                type="button"
                onClick={closePreview}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>

            <div className="max-h-[80vh] overflow-auto p-6">
              {previewLoading && (
                <div className="py-12 text-center text-sm text-gray-500">
                  Carregando visualização...
                </div>
              )}

              {!previewLoading && previewError && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {previewError}
                </div>
              )}

              {!previewLoading &&
                !previewError &&
                previewUrl &&
                previewType === "image" && (
                  <img
                    src={previewUrl}
                    alt={previewFile?.filename}
                    className="mx-auto max-h-[70vh] rounded-lg border border-gray-200"
                  />
                )}

              {!previewLoading &&
                !previewError &&
                previewUrl &&
                previewType === "pdf" && (
                  <iframe
                    src={previewUrl}
                    title={previewFile?.filename}
                    className="h-[70vh] w-full rounded-lg border border-gray-200"
                  />
                )}

              {!previewLoading &&
                !previewError &&
                previewUrl &&
                previewType === "text" && (
                  <iframe
                    src={previewUrl}
                    title={previewFile?.filename}
                    className="h-[70vh] w-full rounded-lg border border-gray-200"
                  />
                )}

              {!previewLoading &&
                !previewError &&
                previewUrl &&
                previewType === "unsupported" && (
                  <div className="space-y-4 text-center">
                    <div className="rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                      Esse tipo de arquivo não possui visualização embutida.
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownload(previewFile)}
                      className="btn-primary"
                    >
                      Baixar arquivo
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Arquivos;
