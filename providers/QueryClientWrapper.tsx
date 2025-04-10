"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const QueryClientWrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryClientWrapper;
