import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { db, findUserByEmail, createUser } from "./db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await findUserByEmail(credentials.email);

        if (!user || !user.password) {
          throw new Error("No account found with this email");
        }

        if (!user.isActive) {
          throw new Error("Account has been deactivated");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // Log activity
        await db.activityLog.create({
          data: {
            userId: user.id,
            action: "LOGIN",
            entity: "User",
            entityId: user.id,
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") {
        return true;
      }

      // For OAuth providers
      if (account && user) {
        const existingUser = await findUserByEmail(user.email!);

        if (!existingUser) {
          // Create new user
          await createUser({
            email: user.email!,
            name: user.name,
            image: user.image,
          });
        }

        // Log activity
        const dbUser = await findUserByEmail(user.email!);
        if (dbUser) {
          await db.activityLog.create({
            data: {
              userId: dbUser.id,
              action: "OAUTH_LOGIN",
              entity: "User",
              entityId: dbUser.id,
              metadata: JSON.stringify({ provider: account.provider }),
            },
          });
        }
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }

      // Handle session update
      if (trigger === "update" && session) {
        token.name = session.user?.name || token.name;
        token.image = session.user?.image || token.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to appropriate page based on role
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signIn({ user }) {
      if (user?.id) {
        await db.activityLog.create({
          data: {
            userId: user.id,
            action: "SIGN_IN",
            entity: "User",
            entityId: user.id,
          },
        });
      }
    },
    async signOut({ token }) {
      if (token?.id) {
        await db.activityLog.create({
          data: {
            userId: token.id,
            action: "SIGN_OUT",
            entity: "User",
            entityId: token.id,
          },
        });
      }
    },
  },
};

// ─── Password Helpers ───────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ─── Auth Helpers ───────────────────────────────────────────────────────

export function getSession() {
  return getServerSession(authOptions);
}

import { getServerSession } from "next-auth";

export async function requireAuth() {
  const session = await getSession();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }

  return user;
}
