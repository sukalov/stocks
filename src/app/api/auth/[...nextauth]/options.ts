import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'username:',
          type: 'text',
        },
        password: {
          label: 'password:',
          type: 'password',
        },
      },
      async authorize(credentials) {
        const password = process.env.ADMIN_PASSWORD ?? '';
        const admin = { id: '1', username: 'admin', password };
        if (credentials?.username === admin.username && credentials.password === admin.password) {
          return admin;
        } else {
          return null;
        }
      },
    }),
  ],
};
