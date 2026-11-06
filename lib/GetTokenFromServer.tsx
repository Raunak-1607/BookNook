import "server-only";

import { headers } from "next/headers";
import { auth } from "./auth";

 export const GetTokenFromServer = async () => {
     const tokenResponse = await auth.api.getToken({
        headers: await headers(),
      });
      const token = tokenResponse?.token;

      return token;
 }