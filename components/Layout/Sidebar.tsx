import React, { useState } from "react";
import { FiChevronsRight, FiDollarSign, FiHome } from "react-icons/fi";
import { motion } from "framer-motion";
import { BsFillGearFill } from "react-icons/bs";
import { BiMoney, BiPieChart } from "react-icons/bi";
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';

interface OptionProps {
  Icon: IconType;
  title: string;
  href: string;
  selected: string;
  setSelected: (title: string) => void;
  open: boolean;
}

interface ToggleCloseProps {
  open: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export const Nav = () => {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const [selected, setSelected] = useState(pathname);

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-[var(--text)] bg-[var(--bg)] p-2 pt-8"
      style={{
        width: open ? "225px" : "fit-content",
      }}
    >
      <div>
        <Option
          Icon={FiHome}
          title="Dashboard"
          href="/dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiDollarSign}
          title="Expenses"
          href="/expenses"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={BiMoney}
          title="Money Sources"
          href="/money-sources"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={BiPieChart}
          title="Categories"
          href="/categories"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={BsFillGearFill}
          title="Settings"
          href="/settings"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({ Icon, title, href, selected, setSelected, open }: OptionProps) => {
  return (
    <motion.a
      href={href}
      layout
      onClick={() => setSelected(href)}
      className={`relative cursor-pointer mb-6 flex h-12 w-full items-center rounded-[var(--border-radius)] transition-all active:scale-95 ${
        selected === href
          ? "bg-[var(--bgSecondary)] text-[var(--text)]"
          : "hover:bg-[var(--color-secondary)]"
      }`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-2xl"
      >
        <Icon />
      </motion.div>

      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-sm font-medium"
        >
          {title}
        </motion.span>
      )}
    </motion.a>
  );
};

const ToggleClose = ({ open, setOpen }: ToggleCloseProps) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-[var(--text)] transition-colors hover:bg-[var(--color-secondary)]"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};
