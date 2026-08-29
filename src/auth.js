import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiClient } from "@/lib/apiClient";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Laravel Login",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          const res = await apiClient.post("/v1/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const data = await res.json().catch(() => ({}));

          if (!res.ok) {
            if (res.status >= 500) {
              throw new Error("Server error. Please try again later.");
            }
            if (data?.message) {
              throw new Error(data.message);
            }
            return null;
          }

          return {
            id: data.user?.id,
            name: data.user?.name,
            email: data.user?.email,
            role: data.user?.role,
            accessToken: data.access_token,
          };
        } catch (error) {
          console.error("Laravel login error:", error);
          if (error.message && error.message !== "Server issue") {
            throw error;
          }
          throw new Error("Server error. Please try again later.");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.accessToken = token.accessToken;

      return session;
    },
  },
};

export default NextAuth(authOptions);
