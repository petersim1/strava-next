"use server";

import { decodeJwt } from "jose";
import { cookies } from "next/headers";

import { JWTtoSignI, IsAuthed } from "@/types/auth";

export const getUser = async (): Promise<IsAuthed> => {
  // middleware will handle token refresh, so we won't need to here.
  const cookieStore = cookies();
  const { value: token } = cookieStore.get("token") ?? { value: undefined };
  if (!token) {
    return { authed: false };
  }

  const decoded = decodeJwt(token);
  const { athlete } = decoded as JWTtoSignI;

  return {
    authed: true,
    user: athlete,
  };
};

export const logout = (): void => {
  const cookieStore = cookies();
  if (cookieStore.has("token")) {
    cookieStore.delete("token");
  }
};
