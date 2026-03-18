import api from "./api";

class UserService {
  async list() {
    const response = await api.get("/users");
    return response.data;
  }

  async get(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  async create(data) {
    const response = await api.post("/users", data);
    return response.data;
  }

  async delete(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }

  async update(id, data) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  }

  async uploadProfileImage(id, file) {
    const formData = new FormData();
    formData.append("profile_image", file);

    const response = await api.post(`/users/${id}/profile-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async getProfileImageBlob(id) {
    const response = await api.get(`/users/${id}/profile-image`, {
      responseType: "blob",
    });

    return response.data;
  }

  async getProfileImageObjectUrl(user) {
    if (!user?.id || !user?.has_profile_image) return null;

    const blob = await this.getProfileImageBlob(user.id);
    return URL.createObjectURL(blob);
  }
}

const userService = new UserService();
export default userService;
