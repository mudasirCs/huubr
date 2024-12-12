import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare } from "bcryptjs"
import { UserRole } from "@prisma/client"
import { prisma } from "./prisma"

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    role: UserRole;
  }
  
  interface Session {
    user: User & {
      id: string;
      role: UserRole;
    }
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role: UserRole;
  }
}

export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    error: "/auth/error"
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user.password) {
          throw new Error("User not found with this email");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in")
        }

        const isValid = await compare(credentials.password, user.password);
        
        if (!isValid) {
          throw new Error("Invalid password");
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      },
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "CUSTOMER" as UserRole,
          emailVerified: true
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
          role: "CUSTOMER" as UserRole,
          emailVerified: true
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn Callback:", { user, account, profile });
      
      try {
        if (account?.provider === "google" || account?.provider === "facebook") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });
  
          if (existingUser) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { 
                emailVerified: true,
//                emailVerificationStatus: "VERIFIED",
                name: user.name || existingUser.name,
                ...(user.image ? { image: user.image } : {})
              }
            });
            
            const existingAccount = await prisma.account.findFirst({
              where: {
                userId: existingUser.id,
                provider: account.provider,
              }
            });
  
            if (!existingAccount) {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  refresh_token: account.refresh_token,
                }
              });
            }
            
            return true;
          } else {
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                ...(user.image ? { image: user.image } : {}),
                role: "CUSTOMER",
                emailVerified: true,
              }
            });
  
            await prisma.account.create({
              data: {
                userId: newUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                refresh_token: account.refresh_token,
              }
            });
  
            return true;
          }
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  
    async jwt({ token, user, account, trigger }) {
      console.log("JWT Callback:", { token, user, account, trigger });
      
      try {
        if (trigger === "signIn") {
          const dbUser = await prisma.user.findUnique({
            where: { 
              email: token.email!
            },
            select: {
              id: true,
              role: true,
              emailVerified: true,
              name: true,
              image: true
            }
          });
          
          if (dbUser) {
            return {
              ...token,
              id: dbUser.id,
              role: dbUser.role,
              emailVerified: dbUser.emailVerified,
              name: dbUser.name,
              picture: dbUser.image
            };
          }
        }
        
        return token;
      } catch (error) {
        console.error("Error in jwt callback:", error);
        return token;
      }
    },
  
    async session({ session, token }) {
      console.log("Session Callback:", { session, token });
      
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          emailVerified: token.emailVerified,
          name: token.name,
          image: token.picture
        }
      };
    }
  },
  events: {
    async signIn(message) {
      console.log("SignIn Event:", message);
    },
    async createUser(message) {
      console.log("CreateUser Event:", message);
    },
    async linkAccount(message) {
      console.log("LinkAccount Event:", message);
    },
    async session(message) {
      console.log("Session Event:", message);
    }
  }
}