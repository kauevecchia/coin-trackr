import { Request, Response } from "express";

export async function logout(request: Request, response: Response) {
  response.clearCookie("refreshToken", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response.status(204).send();
}
