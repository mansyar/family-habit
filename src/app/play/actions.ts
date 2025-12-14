"use server";

import { cookies } from "next/headers";

export async function setChildSessionCookie(childId: string) {
  const cookieStore = await cookies();
  cookieStore.set("childSessionId", childId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}
