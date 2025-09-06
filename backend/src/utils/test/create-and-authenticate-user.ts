import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { Server } from "http";
import request from "supertest";

export async function createAndAuthenticateUser(app: Server) {
  const uniqueEmail = `johndoe-${Date.now()}-${Math.random().toString(36).substring(2, 8)}@example.com`;
  const password = "123456";

  await prisma.user.create({
    data: {
      name: "John Doe",
      email: uniqueEmail,
      password_hash: await hash(password, 6),
    },
  });

  const authResponse = await request(app).post("/sessions").send({
    email: uniqueEmail,
    password: password,
  });

  const { token } = authResponse.body;

  const setCookieHeader = authResponse.headers["set-cookie"];

  let refreshToken: string | null = null;
  if (setCookieHeader && Array.isArray(setCookieHeader)) {
    const refreshTokenCookie = setCookieHeader.find((cookie) =>
      cookie.startsWith("refreshToken=")
    );
    if (refreshTokenCookie) {
      refreshToken = refreshTokenCookie
        .split(";")[0]
        .replace("refreshToken=", "");
    }
  }

  return {
    token,
    refreshToken,
    email: uniqueEmail,
  };
}
