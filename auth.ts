import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signIn as apiSignIn, verifyMfa as apiVerifyMfa } from "@/app/lib/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        mfaToken: { label: "MFA Token", type: "text" },
        mfaUser: { label: "MFA User", type: "text" }, // We can pass serialized user data here
      },
      async authorize(credentials) {
        if (credentials?.mfaToken && credentials?.mfaUser) {
          const user = JSON.parse(credentials.mfaUser as string);
          return {
            id: String(user.id),
            name: user.username,
            email: user.email,
            backendToken: credentials.mfaToken as string,
            status: "SUCCESS"
          };
        }

        try {
          const data = await apiSignIn({
            username: credentials?.username,
            password: credentials?.password,
          });

          return {
            id: data.id ? String(data.id) : "temp",
            name: data.username,
            email: data.email,
            backendToken: data.token,
            status: data.status
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.backendToken = (user as any).backendToken;
        token.username = user.name || "";
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).backendToken = token.backendToken;
      (session as any).username = token.username;
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
});

export const verifyMfa = apiVerifyMfa;
