import { CookieOptions } from "express";

const client_url = process.env.CLIENT_URL as string;
const environment = process.env.ENVIRONMENT as string;

export const corsOptions = {
  origin: [client_url],
  methods: ["POST", "GET", "DELETE", "PATCH"],
  credentials: true,
};

export const cookieOptions:CookieOptions = {
  httpOnly:true,
  secure:environment === "production",
  domain: environment === "production" ? client_url: "localhost",
  sameSite:"strict"
};
