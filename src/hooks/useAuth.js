import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const user = session?.user || null;
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const role = user?.role || null;
  const accessToken = session?.accessToken || null;

  return {
    session,
    user,
    role,
    accessToken,
    isAuthenticated,
    isLoading,
    isAdmin: role === "admin",
  };
}
