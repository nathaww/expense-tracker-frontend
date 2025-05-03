"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import Stars from "@/components/UI/Stars";

const LandingPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div

      className="relative grid min-h-screen place-content-center overflow-hidden bg-[var(--bg)] px-4 py-24"
    >
      <div className="relative z-10 flex flex-col items-center">
        <span className="mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm">
          Beta Now Live!
        </span>
        <h1 className="max-w-6xl bg-gradient-to-br from-[var(--text)] to-[var(--border-color)] bg-clip-text text-center text-3xl font-extrabold uppercase text-transparent sm:text-5xl sm:leading-tight md:text-8xl md:leading-tight">
          Track every penny, save every dime.
        </h1>
        <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed">
          Take control of your finances with real-time tracking, smart
          insights, and a clean interface built to help you save more and
          stress less.
        </p>
        <Link href="/register"
          className="group relative transition-all active:scale-95 hover:scale-105 flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 btn"
        >
          Start for free
          <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
        </Link>
      </div>

      <Stars/>
    </div>
  );
};

export default LandingPage;
