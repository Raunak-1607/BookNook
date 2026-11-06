import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_URL as string);
const db = client.db('BookNook');

export const auth = betterAuth({
     emailAndPassword: { 
    enabled: true, 
  },
  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
     plugins: [
        jwt(), 
    ],
    session:{
      cookieCache:{
        enabled:true,
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 2, // 2 days
      }
    },
  database: mongodbAdapter(db, {
    client,
  }),
});