import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_BASE_URL = process.env.EXTERNAL_API_BASE_URL;

// Authenticate user through the external API
async function authenticateUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return null;
    }
    return data;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const authData = await authenticateUser(
          credentials.email,
          credentials.password,
        );

        if (!authData) return null;

        return {
          id: authData.user.id,
          name: authData.user.name,
          email: authData.user.email,
          accessToken: authData.token,
          tokenExpires: authData.expires,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          accessToken: user.accessToken,
          tokenExpires: user.tokenExpires,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Token has expired, force user to log in again
        if (token.tokenExpires && Date.now() > token.tokenExpires) {
          return {};
        }

        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.token = token.accessToken;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
