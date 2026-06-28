"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react"

export function LogoutButton() {
  const logout = async () => {
    signOut({callbackUrl:"/auth/login"});
  };

  return <Button onClick={logout}>Logout</Button>;
}
