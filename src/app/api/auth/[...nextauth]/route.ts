import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      try {
        if (account?.provider === 'google') {
          // You can perform custom logic here if needed
          return true;
        }
        return true;
      } catch (error: any) {
        console.error("SignIn Callback Error:", error);
        return `/login?error=SignInCallbackError_${encodeURIComponent(error.message || 'unknown')}`;
      }
    },
    async jwt({ token, user, trigger, session }: { token: any; user: any; trigger?: string; session?: any }) {
      try {
        if (user) {
          token.email = user.email;
        }

        if (typeof token.hasCompletedProfile === 'undefined' && token.email) {
          const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser.id;
            token.hasCompletedProfile = !!dbUser.idCard && !!dbUser.phone;
          }
        }

        if (trigger === "update" && session?.hasCompletedProfile) {
          token.hasCompletedProfile = session.hasCompletedProfile;
        }
      } catch (e: any) {
        console.error("JWT Callback Error:", e);
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
