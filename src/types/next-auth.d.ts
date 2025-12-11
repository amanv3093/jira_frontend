import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    token: string;
    refreshToken?: string;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      role: string;
      token: string;
      refreshToken?: string;
    };
  }
}
