// middleware.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function isAuthenticated() {
  const session = await getServerSession(authOptions);
  return session;
}
