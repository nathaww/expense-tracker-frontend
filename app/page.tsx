"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { FiArrowRight } from "react-icons/fi";

const LandingPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <div className="w-full h-screen bg-[var(--bg)] grid grid-cols-1 md:grid-cols-2 gap-8 p-1">
        {/* Left Section */}
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-8xl text-[var(--color-primary)] font-extrabold">
            Track every cent,
            <br />
            with ease.
          </h1>
          <p className="text-base text-[var(--text)] max-w-md">
            Take control of your finances with real-time tracking, smart
            insights, and a clean interface built to help you save more and
            stress less.
          </p>
          <a
            href="/register"
            className="group relative flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-secondary)] px-4 py-2 text-[var(--text)] transition-all active:scale-95 hover:opacity-90"
          >
            Get Started
            <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
          </a>
        </div>

        {/* Right Section - Grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-1 text-center">
          <div className="border border-[var(--border-color)] transition-all hover:scale-95 hover:bg-[var(--color-secondary)] flex items-end justify-start p-1 font-medium">
            Attention to Detail
          </div>
          <div className="border border-[var(--border-color)] transition-all hover:scale-95 hover:bg-[var(--color-secondary)] flex items-end justify-start p-1 font-medium">
            Easy to Use
          </div>
          <div className="border border-[var(--border-color)] transition-all hover:scale-95 hover:bg-[var(--color-secondary)] flex items-end justify-start p-1 text-2xl font-semibold">
            8
            <br />
            <span className="text-xs font-normal">Unique Themes</span>
          </div>
          <div className="border border-[var(--border-color)] transition-all hover:scale-95 hover:bg-[var(--color-secondary)] flex items-end justify-start p-1 text-2xl font-semibold">
            AI features
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
