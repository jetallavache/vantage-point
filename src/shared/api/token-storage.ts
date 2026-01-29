import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const tokenStorage = {
  getAccessToken: (): string | null => Cookies.get(ACCESS_TOKEN_KEY) || null,
  getRefreshToken: (): string | null => Cookies.get(REFRESH_TOKEN_KEY) || null,

  setTokens: (accessToken: string, refreshToken: string) => {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken);
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },
};
