import { Request, Response } from "express";

export async function logout(request: Request, response: Response) {
  response.clearCookie("refreshToken");

  return response.status(204).send();
}
