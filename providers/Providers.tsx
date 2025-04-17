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
  const [isLoading, setIsLoading] = useState(true);
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated && !isPublicRoute) {
          router.replace("/login");
        } else if (isAuthenticated && isPublicRoute) {
          router.replace("/dashboard");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="bottom-right" richColors duration={2000} />
        {isAuthenticated && !isPublicRoute ? (
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow px-4 py-8">{children}</main>
            <Footer />
          </div>
        ) : (
          children
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
