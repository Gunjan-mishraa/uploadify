// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const email = credentials?.email;
        if (!email || !credentials?.password) return null;

        const user = await User.findOne({ email });
        // credentials.password may be undefined in the type, ensure it's a string at runtime
        if (user && user.password && bcrypt.compareSync(String(credentials.password), String(user.password))) {
          return { id: user._id.toString(), email: user.email };
        }
        return null;
      },
    }),
  ],
  // typed as NextAuthOptions so "strategy" accepts the correct literal type
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },

  // Use `any` here to avoid extra TypeScript type work during build.
  // You can later replace `any` with proper types if you want stricter checking.
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        // ensure these fields exist on session.user
        session.user = session.user || {};
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      // Redirect to home after login (not back to /login)
      if (url && url.startsWith(baseUrl)) return baseUrl;
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };