import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {  signIn } from "@/services/auth/auth";

interface CustomUser extends User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  token: string;
  refreshToken: string;
  session :{
    user: User;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const response = await signIn(
          credentials.email,
          credentials.password
        );

        console.log("loginAdmin response:", response);

        if (response.user && response.accessToken) {
          return {
            ...response.user,
            token: response.accessToken,
            refreshToken: response.refreshToken,
          } as CustomUser;
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user as CustomUser;
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
