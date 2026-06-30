'use client'

import { useSession } from 'next-auth/react';
import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";

export function AuthButton() {
const { data: session, status } = useSession();

  return status === "authenticated" ? (
    <div className="flex items-center gap-4">
      Hey, {session?.user?.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Register</Link>
      </Button>
    </div>
  );
}
