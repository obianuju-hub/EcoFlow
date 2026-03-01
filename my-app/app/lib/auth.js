import NextAuth from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace with your "hardcoded" user for now
        if (
          credentials.email === "enekebe12@gmail.com" &&
          credentials.password === "Obianuju"
        ) {
          return { id: "1", email: credentials.email };
        }
        return null; // invalid credentials
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/Signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to token on sign in
      if (user) {
        token.email = user.email;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add token info to session
      if (token) {
        session.user = session.user || {};
        session.user.email = token.email;
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Helper function for server components
export const auth = () => getServerSession(authOptions);