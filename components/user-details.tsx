"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export function UserDetails() {

   const {data: session } = useSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return JSON.stringify(session.user, null, 2);
}