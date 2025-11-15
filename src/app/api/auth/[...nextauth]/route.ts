import NextAuth from 'next-auth/next';
import { authOptions } from './options';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

declare module "next-auth" {
  interface Session {
    user: {
      token: string;
      id: string;
      email: string;
      name: string;
    };
  }
}