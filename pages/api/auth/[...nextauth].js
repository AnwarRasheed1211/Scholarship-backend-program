import NextAuth from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { connectToDatabase } from '../../../lib/db';

export default NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
      authorization: {
        params: { scope: 'openid email profile User.Read offline_access' },
      },
      httpOptions: { timeout: 10000 },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the id_token, expires_at & refresh_token to the token right after signin
      if (account && user) {
        return {
          accessToken: account.id_token,
          accessTokenExpires: account.expires_at * 1000, // Convert seconds to milliseconds
          refreshToken: account.refresh_token,
          user,
        };
      }

      // Check if the access token is expired
      if (Date.now() < token.accessTokenExpires - 100000) {
        return token;
      }

      // Refresh the access token if it has expired
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session) {
        session.user = token.user;
        session.error = token.error;
        session.accessToken = token.accessToken;

        // Fetch user-specific route from MongoDB based on the user's email
        try {
          const db = await connectToDatabase('scholarship');
          const user = await db.collection('user').findOne({ email: session.user.email });

          if (user && user.route) {
            session.user.route = user.route;
          }

          // Check the user's roles and add them to the session
          if (user && user.role) {
            session.user.role = user.role;
          }
        } catch (error) {
          console.error('Error fetching user-specific route:', error);
        }
      }
      return session;
    },
  },
});