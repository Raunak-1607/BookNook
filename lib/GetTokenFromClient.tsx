import "client-only";

import { authClient } from "./auth-client";

export const GetTokenFromClient = async (): Promise<string> => {
  try {
    const { data } = await authClient.token();
    return data?.token || "";
  } catch {
    return "";
  }
};
