"use client"

import React, { useState, useEffect } from "react";
import { FiDollarSign, FiHome } from "react-icons/fi";
import { BsFillGearFill } from "react-icons/bs";
import { BiMoney, BiPieChart } from "react-icons/bi";
import { TbChartBar } from "react-icons/tb";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { AnimatePresence, motion } from "framer-motion";

interface OptionProps {
  Icon: IconType;
  title: string;
  href: string;
  selected: string;
  setSelected: (title: string) => void;
  open: boolean;
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
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const [selected, setSelected] = useState(pathname);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint - tablets and smaller use bottom nav
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}      <motion.nav
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={false}
        animate={{ width: isHovered ? 225 : 56 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`nav-sidebar sticky top-0 h-screen shrink-0 border-r border-[var(--border-color)] bg-[var(--bg)] p-2 pt-8 z-20 overflow-hidden ${
          isMobile ? 'hidden' : 'flex flex-col'
        }`}
      >
        <div>
          {navItems.map((item) => (
            <Option
              key={item.href}
              Icon={item.Icon}
              title={item.title}
              href={item.href}
              selected={selected}
              setSelected={setSelected}
              open={isHovered}
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

const Option = ({ Icon, title, href, selected, setSelected, open }: OptionProps) => {
  const isActive = selected === href;

  return (
    <motion.a
      href={href}
      onClick={() => setSelected(href)}
      initial={false}
      layout
      className={`relative cursor-pointer mb-2 flex h-12 w-full items-center rounded-[var(--border-radius)] transition-colors duration-300 ease-in-out active:scale-95 ${
        isActive
          ? "bg-[var(--bgSecondary)] text-[var(--text)]"
          : "hover:bg-[var(--color-secondary)]"
      }`}
    >
      <div
        className={`flex items-center justify-center text-2xl transition-all duration-300 ease-in-out ${
          open ? "w-10 ml-2 mr-2" : "w-full"
        }`}
      >
        <Icon />
      </div>
      <AnimatePresence>
        {open && (
          <motion.span
            key="text"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium whitespace-nowrap overflow-hidden"
          >
            {title}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
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

  return (    <motion.nav
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

  return (
    <motion.a
      href={href}
      onClick={() => setSelected(href)}
      whileTap={{ scale: 0.9 }}
      className={`flex flex-col items-center justify-center py-2 px-2 min-w-[60px] rounded-lg transition-colors duration-200 ${
        isActive
          ? "text-[var(--color-primary)] bg-[var(--bgSecondary)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--color-secondary)]"
      }`}
    >
      <div className={`text-xl mb-1 transition-colors duration-200 ${isActive ? 'text-[var(--color-primary)]' : ''}`}>
        <Icon />
      </div>
      <span className={`text-xs font-medium text-center leading-tight transition-colors duration-200 ${
        isActive ? 'text-[var(--color-primary)]' : ''
      }`}>
        {title}
      </span>
    </motion.a>
  );
};
