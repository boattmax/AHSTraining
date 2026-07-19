import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        idCard: { label: "หมายเลขบัตรประชาชน", type: "text" },
        dob: { label: "วัน/เดือน/ปีเกิด (พ.ศ.)", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.idCard || !credentials?.dob) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { idCard: credentials.idCard }
        });

        if (!user || !user.dob) {
          return null;
        }

        // Parse DB DOB to DD/MM/YYYY (Buddhist Era)
        const date = new Date(user.dob);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const yearBE = String(date.getFullYear() + 543);
        const dbDobFormatted = `${day}/${month}/${yearBE}`;

        if (credentials.dob !== dbDobFormatted) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: { token: any; user: any; trigger?: string; session?: any }) {
      if (user) {
        token.email = user.email;
      }

      // If we don't have hasCompletedProfile in the token, fetch it!
      // This is necessary because on first Google OAuth login, the database user might just be created.
      if (typeof token.hasCompletedProfile === 'undefined' && token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser.id;
          token.hasCompletedProfile = !!dbUser.idCard && !!dbUser.phone;
        }
      }

      // Handle session update after profile completion
      if (trigger === "update" && session?.hasCompletedProfile) {
        token.hasCompletedProfile = session.hasCompletedProfile;
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.hasCompletedProfile = token.hasCompletedProfile;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
