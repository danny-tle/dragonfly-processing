"use server";

import { cookies } from "next/headers";
import { AGE_COOKIE } from "@/lib/age-gate";

// Runs on the server when the visitor clicks "Yes". Setting a cookie inside a
// Server Action makes Next.js re-render the page, so the gate disappears.
export async function confirmAge() {
  const cookieStore = await cookies();
  cookieStore.set(AGE_COOKIE, "1", {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // remember for 30 days
    sameSite: "lax",
    httpOnly: true,
  });
}
