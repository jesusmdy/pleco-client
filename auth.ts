import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          }
        );

        if (!res.ok) return null;

        const data = await res.json();
        if (!data?.token) return null;

        return {
          id: data.id ? String(data.id) : "temp",
          name: data.username,
          email: data.email,
          backendToken: data.token,
          status: data.status
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.backendToken = (user as any).backendToken;
        token.username = user.name;
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
