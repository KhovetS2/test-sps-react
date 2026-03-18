import api from "./api";

const fileService = {
  async list() {
    const response = await api.get("/files");
    return response.data;
  },

  async upload(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  async download(id) {
    const response = await api.get(`/files/${id}`, {
      responseType: "blob",
    });

    return response.data;
  },
};

export default fileService;
