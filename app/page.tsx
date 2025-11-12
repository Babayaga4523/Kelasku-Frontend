"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated by checking localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.role) {
          if (user.role === 'admin') {
            router.push('/dashboard/admin');
          } else if (user.role === 'siswa') {
            router.push('/dashboard/student');
          } else {
            router.push('/dashboard');
          }
          return;
        }
      } catch {
        // Invalid user data, redirect to login
        router.push('/login');
        return;
      }
    } else {
      // No token or user, redirect to login
      router.push('/login');
      return;
    }
  }, [router]);

  // Always redirect, so show loading spinner
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}
