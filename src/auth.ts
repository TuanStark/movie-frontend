import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email và mật khẩu là bắt buộc");
          }

          // Call login API
          const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const authData = await loginRes.json();
          console.log("Login response:", authData);

          if (!loginRes.ok || !authData?.data) {
            throw new Error(authData.message || "Đăng nhập thất bại");
          }

          // Fetch user profile using accessToken
          const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authData.data.accessToken}`,
            },
          });

          const profileData = await profileRes.json();
          console.log("Profile response:", profileData);

          if (!profileRes.ok || !profileData) {
            // If profile fetch fails, use data from login response
            console.warn("Profile fetch failed, using login data only");
            return {
              id: authData.data.id || "unknown",
              email: authData.data.email || credentials.email,
              name: authData.data.name || credentials.email,
              role: authData.data.role || "USER",
              accessToken: authData.data.accessToken,
              refreshToken: authData.data.refreshToken,
              accessTokenExpires: authData.data.accessTokenExpires,
            };
          }

          // Combine data from login and profile
          return {
            id: profileData.id || authData.data.id || "unknown",
            email: profileData.email || authData.data.email || credentials.email,
            name: `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim() || authData.data.name || credentials.email,
            role: profileData.role || authData.data.role || "USER",
            accessToken: authData.data.accessToken,
            refreshToken: authData.data.refreshToken,
            accessTokenExpires: authData.data.accessTokenExpires,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
            method: "POST",
            body: JSON.stringify({ idToken: account.id_token }),
            headers: { "Content-Type": "application/json" },
          });

          const data = await res.json();
          if (!res.ok || !data?.data) {
            throw new Error(data.message || "Google login failed");
          }

          // Update user with data from backend
          user.id = data.data.id || "unknown";
          user.email = data.data.email || user.email;
          user.name = data.data.name || user.name;
          user.accessToken = data.data.accessToken;
          user.refreshToken = data.data.refreshToken;
          user.accessTokenExpires = data.data.accessTokenExpires;

          return true;
        } catch (error) {
          console.error("Google signIn error:", error);
          return false;
        }
      }
      return true; // Credentials login
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
      }

      // Refresh token if expired
      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires * 1000) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: "POST",
            body: JSON.stringify({ refreshToken: token.refreshToken }),
            headers: { "Content-Type": "application/json" },
          });

          const data = await res.json();
          if (!res.ok || !data?.data) {
            throw new Error(data.message || "Failed to refresh token");
          }

          token.accessToken = data.data.accessToken;
          token.refreshToken = data.data.refreshToken;
          token.accessTokenExpires = data.data.accessTokenExpires;
        } catch (error) {
          console.error("Refresh token error:", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error) {
        // Handle token error if needed
      } else {
        session.user.id = token.id;
        session.user.email = token.email || session.user.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.accessTokenExpires = token.accessTokenExpires;
      }
      console.log("Session:", session);
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);