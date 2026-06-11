import NextAuth, { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { db as prisma } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Kullanıcı Adı", type: "text" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        // Geçici basit giriş mekanizması
        if (credentials?.username === "admin" && credentials?.password === "admin35") {
          let user = await prisma.user.findUnique({ where: { email: "admin@ozkanbilge.com" } })
          if (!user) {
             user = await prisma.user.create({
               data: {
                 name: "Özkan Bilge",
                 email: "admin@ozkanbilge.com",
                 role: "ADMIN"
               }
             })
          }
          return user
        }
        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  }
}
