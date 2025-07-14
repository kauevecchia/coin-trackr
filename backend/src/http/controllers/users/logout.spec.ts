// src/http/controllers/users/logout.e2e.spec.ts

import request from "supertest";
import { app } from "../../../app";
import { prisma } from "../../../lib/prisma";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Server } from "http";
import { createAndAuthenticateUser } from "../../../utils/test/create-and-authenticate-user";

let testServer: Server;

describe("Logout (E2E)", () => {
  beforeAll(async () => {
    testServer = app.listen(0);
  });

  beforeEach(async () => {
    await prisma.transaction.deleteMany();
    await prisma.cryptoCache.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await new Promise((resolve, reject) => {
      if (testServer) {
        testServer.close((err) => {
          if (err) reject(err);
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  });

  it("should be able to logout successfully and clear refresh token cookie", async () => {
    const { token, refreshToken } = await createAndAuthenticateUser(testServer);

    expect(token).toBeDefined();
    expect(refreshToken).toBeDefined();

    const response = await request(testServer)
      .post("/logout")
      .set("Cookie", `refreshToken=${refreshToken}`);

    expect(response.statusCode).toEqual(204);
    expect(response.body).toEqual({});

    expect(response.headers["set-cookie"]).toBeDefined();
    const setCookieHeader = response.headers["set-cookie"][0];

    expect(setCookieHeader).toContain("refreshToken=;");
    expect(setCookieHeader).toContain("Expires=");
    expect(setCookieHeader).toContain("HttpOnly");
    expect(setCookieHeader).toContain("Path=/");
  });

  it("should not be able to use refresh token after logout", async () => {
    const { token, refreshToken } = await createAndAuthenticateUser(testServer);

    await request(testServer)
      .post("/logout")
      .set("Cookie", `refreshToken=${refreshToken}`);

    const refreshResponse = await request(testServer)
      .post("/token/refresh");

    expect(refreshResponse.statusCode).toEqual(401);
    expect(refreshResponse.body.message).toEqual(
      "Refresh token não fornecido."
    );
  });
});
