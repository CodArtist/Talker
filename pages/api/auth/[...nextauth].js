import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
          })
      // ...add more providers here
    ],
    jwt: {
        encryption: true
      },
      secret: "secret token",
    // session: {
    //     jwt: {
    //       signingKey: {
    //         kty: 'oct',
    //         kid: `${process.env.kid}`,
    //         alg: 'HS512',
    //         k: `${process.env.k}`,
    //       },
    //       secret: `${process.env.SECRET}`,
    //     },
    //   },
    //   debug: true,
    //   theme: 'dark',
    
  })