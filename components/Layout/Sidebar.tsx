"use client"

import React, { useState, useEffect } from "react";
import { FiDollarSign, FiHome } from "react-icons/fi";
import { BsFillGearFill } from "react-icons/bs";
import { BiMoney, BiPieChart } from "react-icons/bi";
import { TbChartBar } from "react-icons/tb";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { motion } from "framer-motion";
import { StyledTooltip } from "@/components/UI/StyledTooltip";

interface OptionProps {
  Icon: IconType;
  title: string;
  href: string;
  selected: string;
  setSelected: (title: string) => void;
}

interface BottomNavOptionProps {
  Icon: IconType;
  title: string;
  href: string;
  selected: string;
  setSelected: (title: string) => void;
}

// Navigation items data
const navItems = [
  { Icon: FiHome, title: "Dashboard", href: "/dashboard" },
  { Icon: FiDollarSign, title: "Expenses", href: "/expenses" },
  { Icon: BiMoney, title: "Money Sources", href: "/money-sources" },
  { Icon: BiPieChart, title: "Categories", href: "/categories" },
  { Icon: TbChartBar, title: "User Insights", href: "/user-insights/spending-comparison" },
  { Icon: BsFillGearFill, title: "Settings", href: "/settings" },
];

export const Nav = () => {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const [selected, setSelected] = useState(pathname);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <motion.nav
        className={`nav-sidebar hidden lg:flex lg:flex-col sticky top-0 h-screen shrink-0 border-r border-[var(--border-color)] bg-[var(--bg)] p-2 pt-8 z-20`}
      >
        <div className="w-full flex flex-col items-center">
          {navItems.map((item) => (
            <Option
              key={item.href}
              Icon={item.Icon}
              title={item.title}
              href={item.href}
              selected={selected}
              setSelected={setSelected}
            />
          ))}
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <div className={isMobile ? 'flex' : 'hidden'}>
        <BottomNavigation selected={selected} setSelected={setSelected} />
      </div>
    </>
  );
};

const Option = ({ Icon, title, href, selected, setSelected }: OptionProps) => {
  const isActive = selected === href;

  return (
    <StyledTooltip
      content={title}
      position="right"
      delay={150}
      className="relative z-50"
    >
      <motion.a
        href={href}
        onClick={() => setSelected(href)}
        initial={false}
        className={`relative cursor-pointer mb-2 flex flex-col h-12 w-full items-center rounded-[var(--border-radius)] overflow-hidden ${isActive
          ? "bg-[var(--bgSecondary)] text-[var(--text)]"
          : "hover:bg-[var(--color-secondary)]"
          }`}
        whileTap={{ scale: 0.97 }}
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
      >
        <div className="flex items-center justify-center w-12 h-12">
          <Icon className="text-2xl" />
        </div>
      </motion.a>
    </StyledTooltip>
  );
};

// Bottom Navigation for Mobile/Tablet
const BottomNavigation = ({ selected, setSelected }: { selected: string; setSelected: (title: string) => void }) => {
  // Show main navigation items for mobile - exclude User Insights to keep it cleaner
  const mobileNavItems = [
    { Icon: FiHome, title: "Dashboard", href: "/dashboard" },
    { Icon: FiDollarSign, title: "Expenses", href: "/expenses" },
    { Icon: BiMoney, title: "Sources", href: "/money-sources" },
    { Icon: BiPieChart, title: "Categories", href: "/categories" },
    { Icon: BsFillGearFill, title: "Settings", href: "/settings" },
  ];

  return (<motion.nav
    initial={{ y: 100 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="nav-sidebar fixed bottom-0 left-0 right-0 bg-[var(--bg)] border-t border-[var(--border-color)] z-50 px-1 py-2 safe-area-pb lg:hidden"
  >
    <div className="flex justify-around items-center max-w-lg mx-auto">
      {mobileNavItems.map((item) => (
        <BottomNavOption
          key={item.href}
          Icon={item.Icon}
          title={item.title}
          href={item.href}
          selected={selected}
          setSelected={setSelected}
        />
      ))}
    </div>
  </motion.nav>
  );
};

const BottomNavOption = ({ Icon, title, href, selected, setSelected }: BottomNavOptionProps) => {
  const isActive = selected === href;

  // For the bottom navigation, we'll keep the text labels but enhance with a tooltip
  return (
    <StyledTooltip content={title} position="top" delay={150}>
      <motion.a
        href={href}
        onClick={() => setSelected(href)}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        className={`flex flex-col items-center justify-center py-2 px-2 min-w-[60px] rounded-lg ${isActive
          ? "text-[var(--color-primary)] bg-[var(--bgSecondary)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--bgSecondary)]/30"
          }`}
      >
        <motion.div
          layout
          className={`text-xl mb-1 ${isActive ? 'text-[var(--color-primary)]' : ''}`}
        >
          <Icon />
        </motion.div>
        <motion.span
          layout
          className={`text-xs font-medium text-center leading-tight ${isActive ? 'text-[var(--color-primary)]' : ''
            }`}
        >
          {title}
        </motion.span>
      </motion.a>
    </StyledTooltip>
  );
};
