"use client";

import { useState } from "react";
import { useSidebar } from "@/context/SideBarContext";
import { BsActivity } from "react-icons/bs";
import { FaBookmark, FaHome, FaRegBookmark } from "react-icons/fa";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import SideBarButtons from "../UI/SideBarButtons";
import { BiCollapse } from "react-icons/bi";
import Button from "../UI/Button";

const nav = [
  {
    name: "Home",
    path: "/",
    activeIcon: <FaHome />,
    icon: <FaHome />,
  },
  {
    name: "Activity",
    path: "/activity",
    activeIcon: <FaHome />,
    icon: <BsActivity />,
  },
  {
    name: "Saved",
    path: "/saved",
    activeIcon: <FaBookmark />,
    icon: <FaRegBookmark />,
  },
  {
    name: "Settings",
    path: "/settings",
    activeIcon: <IoSettingsSharp />,
    icon: <IoSettingsOutline />,
  },
];

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <aside
      className={` relative h-screen flex flex-col justify-between bg-bg drop-shadow-lg dark:bg-primaryDark will-change-transform transition-all px-1 pb-1 pt-4 origin-left ${
        isOpen ? "w-[15%] translate-x-1 scale-x-1" : "w-auto translate-x-1 scale-x-1"
      }`}
    >
      <div>
        {nav.map((item) => (
          <SideBarButtons key={item.path} {...item} />
        ))}
      </div>

      <Button
        className="size-10 bg-primary hover:bg-primary/40"
        icon={<BiCollapse className="text-text text-2xl text-center" />}
        onClick={() => setIsOpen(!isOpen)}
      ></Button>
    </aside>
  );
};

export default SideBar;
