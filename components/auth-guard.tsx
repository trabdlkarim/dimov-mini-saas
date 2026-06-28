"use client";

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function AuthGuard({ children }:{
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    redirect('/auth/login');
  }
  

  return children;
}