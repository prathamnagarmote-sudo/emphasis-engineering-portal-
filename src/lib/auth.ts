import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        await connectToDatabase();

        // ADMIN SEED INJECTION
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@emphasis.com";
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

        if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
          let adminUser = await User.findOne({ email: ADMIN_EMAIL });
          if (!adminUser) {
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
            adminUser = await User.create({
              name: "Admin User",
              email: ADMIN_EMAIL,
              password: hashedPassword,
              role: "admin",
              isVerified: true,
            });
          } else {
             adminUser.role = "admin";
             adminUser.isVerified = true;
             await adminUser.save();
          }
          return {
            id: adminUser._id.toString(),
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
          };
        }
        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user) throw new Error("Invalid credentials");
        
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) throw new Error("Invalid credentials");

        if (!user.isVerified) {
          throw new Error("UnverifiedEmail");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        console.log("Attempting Google Sign-in for:", user.email);
        try {
          await connectToDatabase();
          console.log("Database connected for sign-in");
          const existing = await User.findOne({ email: user.email });
          if (!existing) {
            console.log("Creating new user for:", user.email);
            await User.create({
              name: user.name,
              email: user.email,
              password: "google-oauth-" + Math.random().toString(36),
              role: "student",
              isVerified: true,
            });
          }
        } catch (e) {
          console.error("CRITICAL: Google sign-in database error:", e);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      
      if (token.email) {
        try {
          await connectToDatabase();
          // Find by email to be safe for both credentials and OAuth users
          const dbUser = await User.findOne({ email: token.email }).select('purchasedContent scheduledServiceIds role _id');
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.purchasedContent = dbUser.purchasedContent || [];
            token.scheduledServiceIds = dbUser.scheduledServiceIds || [];
          }
        } catch (e) {
          console.error("Failed to fetch user data for token", e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        (session.user as any).purchasedContent = token.purchasedContent as string[] || [];
        (session.user as any).scheduledServiceIds = token.scheduledServiceIds as string[] || [];
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

