"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { PropsWithChildren, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

const publicRoutes = [
  "/",
  "/register",
  "/login",
  "/verify-email",
  "/verify-code",
  "/forgot-password",
];

export default function Providers({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
    } else if (isAuthenticated && isPublicRoute) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router, isPublicRoute]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="bottom-right" richColors duration={2000} />
        {isAuthenticated ? (
          <>
            <Navbar />
            {children}
            <Footer />
          </>
        ) : (
          <>{children}</>
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
