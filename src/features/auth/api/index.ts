import { apiClient } from "../../../shared";
import { LoginRequest, TokenResponse } from "../model/types";

export const authApi = {
  login: (data: LoginRequest): Promise<TokenResponse> => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    return apiClient.post("/auth/token-generate", formData, {
      requireAuth: false,
    });
  },

  refreshToken: (refreshToken: string): Promise<TokenResponse> => {
    const formData = new FormData();
    formData.append("refresh_token", refreshToken);

    return apiClient.post("/auth/token-refresh", formData, {
      requireAuth: false,
    });
  },
};
