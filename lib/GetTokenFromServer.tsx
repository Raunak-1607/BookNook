import "server-only";

import { headers } from "next/headers";
import { auth } from "./auth";

export const GetTokenFromServer = async (): Promise<string | null> => {
  try {
    const tokenResponse = await auth.api.getToken({
      headers: await headers(),
    });
    return tokenResponse?.token ?? null;
  } catch {
    return null;
  }
};
