"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { FiArrowRight, FiPieChart, FiTrendingUp, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import Stars from "@/components/UI/Stars";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5 }}
    className="bg-[var(--bgSecondary)] backdrop-blur-lg rounded-[var(--border-radius)] p-6 border border-[var(--border-color)] hover:border-[var(--color-primary)]/20 hover:shadow-lg transition-all group"
  >
    <div className="rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-3 w-fit mb-4 text-[var(--text)] group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-[var(--text)] mb-2">{title}</h3>
    <p className="text-[var(--text)]/70 text-sm">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen overflow-hidden">
      <div
        className=" h-full w-full flex flex-col justify-center items-center px-4 py-20 sm:py-32"
        style={{
          background: `radial-gradient(circle at top right, var(--color-primary), transparent 40%), 
                       var(--bg)`
        }}
      >

        <div className=" z-10 flex flex-col items-center max-w-6xl mx-auto">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-[var(--text)]/10 px-4 py-1.5 text-sm backdrop-blur-md border border-[var(--text)]/10 text-[var(--text)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
            </span>
            Alpha Now Live!
          </motion.span>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-gradient-to-br from-[var(--text)] via-[var(--text)] to-[var(--text)]/60 bg-clip-text text-center text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase text-transparent leading-tight md:leading-tight"
          >
            Track every penny,
            <br /> save every dime.
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="my-8 max-w-2xl text-center text-base sm:text-lg leading-relaxed text-[var(--text)]/80 px-4"
          >
            Take control of your finances with real-time tracking, smart
            insights, and a clean interface built to help you save more and
            stress less. Modern tools for modern money management.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link href="/register"
              className="group relative flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-3 text-[var(--text)] font-medium hover:shadow-lg hover:shadow-[var(--color-primary)]/20 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Start for free
              <FiArrowRight className="transition-transform group-hover:translate-x-1 group-hover:-rotate-45" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8">
            <FeatureCard
              icon={<FiPieChart size={24} />}
              title="Expense Insights"
              description="Visualize your spending patterns with interactive charts and detailed breakdowns by category, date, and source."
            />
            <FeatureCard
              icon={<FiTrendingUp size={24} />}
              title="Budget Tracking"
              description="Set budgets for different categories and track your progress with real-time updates and smart notifications."
            />
            <FeatureCard
              icon={<FiShield size={24} />}
              title="Secure & Private"
              description="Your financial data is protected with industry-standard encryption and privacy-focused design."
            />
          </div>

        </div>


      </div>

      {/* Background decoration */}
      <div className="absolute bottom-10 -left-10 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-primary)', opacity: '0.2' }}></div>
      <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-secondary)', opacity: '0.2' }}></div>

      <Stars />
    </div>
  );
};

export default LandingPage;
