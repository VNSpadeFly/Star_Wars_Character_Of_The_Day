import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.IdentityProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorizationUrl: process.env.AUTHORIZATION_URL,
      tokenUrl: process.env.TOKEN_URL,
      userinfoUrl: process.env.USERINFO_URL,
      scope: 'openid profile email',
    }),
  ],
  callbacks: {
    async session(session, token) {
      session.user.id = token.sub;
      return session;
    },
    async jwt(token, user, account) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
  },
});
