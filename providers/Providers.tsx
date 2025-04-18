"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { PropsWithChildren, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import Loader from "@/components/UI/Loader";
import { Nav } from "@/components/Layout/Sidebar";

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
  const { isAuthenticated, isInitialized } = useAuth();
  const isPublicRoute = publicRoutes.includes(pathname);

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

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
    } else if (isAuthenticated && isPublicRoute) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isInitialized, router, isPublicRoute]);

  if (!isInitialized) {
    return (
      <ThemeProvider>
        <Loader />;
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="bottom-right" richColors duration={4000} />
        {isAuthenticated && !isPublicRoute ? (
          <div className="min-h-screen flex">
            <Nav />
            <main className="w-full">
              <Navbar />
              {children}
              <Footer />
            </main>
          </div>
        ) : (
          children
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
