// auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/prisma" // Sesuaikan path Prisma lu
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        // Jika user nggak ada atau password belum diset (misal login Google)
        if (!user || !user.password) return null;

        // Bandingkan password murni dengan hash di DB
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string, 
          user.password
        );

        if (passwordsMatch) return user;
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login', // Arahkan ke halaman login custom kita
  },
  callbacks: {
    // Membawa info user ke session JWT
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    }
  },
  secret: process.env.AUTH_SECRET, // WAJIB ada di .env (generate pakai: npx auth secret)
})