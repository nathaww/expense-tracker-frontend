"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

type Props = {
  name: string;
  path: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  className?: string;
};

const SideBarButtons: React.FC<Props> = ({ name, path, icon, activeIcon, className }) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(path);

  return (
    <button
      className={twMerge(
        "flex items-center gap-x-3 px-4 py-2 active:scale-95 transition-all md:text-lg w-full my-3 ",
        isActive ? "text-text font-semibold " : "text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:dark:text-gray-300 font-semibold",
        className
      )}
    >
      {isActive ? activeIcon : icon}
      <span>{name}</span>
    </button>
  );
};

export default SideBarButtons;
