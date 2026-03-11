import type { NextAuthOptions } from "next-auth";
import type { Provider } from "next-auth/providers/index";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signIn as authServiceSignIn } from "@/services/auth/auth";

// Build providers list — only add Google if env vars are configured
const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const response = await authServiceSignIn(
        credentials.email as string,
        credentials.password as string
      );

      if (response.success === false) {
        throw new Error(response.message || "Invalid credentials");
      }

      if (response.user && response.accessToken) {
        return {
          ...response.user,
          token: response.accessToken,
          refreshToken: response.refreshToken,
        };
      }

      return null;
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Credentials login
      if (account?.provider === "credentials" && user) {
        token.user = user;
      }

      // Google login — call our backend to get/create user + tokens
      if (account?.provider === "google" && profile) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: profile.email,
                first_name: (profile as any).given_name || profile.name?.split(" ")[0] || "",
                last_name: (profile as any).family_name || profile.name?.split(" ").slice(1).join(" ") || "",
                avatarUrl: (profile as any).picture || null,
              }),
            }
          );
          const data = await res.json();

          if (data.user && data.accessToken) {
            token.user = {
              ...data.user,
              token: data.accessToken,
              refreshToken: data.refreshToken,
            };
          }
        } catch (err) {
          console.error("Google auth backend error:", err);
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
  pages: { signIn: "/sign-in" },
  session: { strategy: "jwt" },
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      role: string;
      token: string;
      refreshToken: string;
    };
  }
}
