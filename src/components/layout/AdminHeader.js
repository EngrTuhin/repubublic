"use client";

import React from "react";
import { BellIcon, SearchIcon, MenuIcon, X } from "lucide-react";
import { useAdmin } from "@/store/AdminContext";
import { RoleBadge } from "@/components/ui/Badge";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminHeader() {
  const { state, isSidebarOpen, toggleSidebar } = useAdmin();
  const pathname = usePathname();

  // Helper to map route pathnames to descriptive titles and subtitles
  const getHeaderDetails = (path) => {
    if (path.startsWith("/dashboard")) {
      return {
        title: "Dashboard",
        subtitle: "Overview of operations and key metrics",
      };
    }
    return { title: "InsureBD", subtitle: "Admin Portal" };
  };

  const { title, subtitle } = getHeaderDetails(pathname);

  // Get initials for profile picture placeholder
  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
      {/* Left side: Hamburger (mobile) + Title (desktop) */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg lg:hidden transition-colors focus:outline-none"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 animate-in fade-in zoom-in duration-200" />
          ) : (
            <MenuIcon className="w-5 h-5 animate-in fade-in zoom-in duration-200" />
          )}
        </button>

        <div className="flex flex-col justify-center">
          <motion.h1
            key={`title-${pathname}`}
            initial={{ x: -12, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-base md:text-lg font-bold text-slate-900 leading-tight tracking-tight"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              key={`subtitle-${pathname}`}
              initial={{ x: -8, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
              className="text-xs text-slate-500 font-medium hidden sm:block truncate max-w-[200px] md:max-w-[400px]"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Search Input with smooth expansion animation */}
        <div className="relative hidden md:block group">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200" />
          <input
            type="text"
            placeholder="Search files, policies..."
            className="w-48 lg:w-64 pl-9 pr-4 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100/50 transition-all duration-300"
          />
        </div>

        {/* Notifications Button with subtle wiggling icon */}
        <button
          aria-label="Notifications"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 rounded-xl transition-all duration-200 active:scale-95 group"
        >
          <BellIcon className="w-5 h-5 group-hover:animate-wiggle" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
        </button>

        {/* User Info / Profile Badge */}
        {state.currentUser && (
          <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-slate-200/80">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-950">
                {state.currentUser.name}
              </p>
              <div className="mt-0.5">
                <RoleBadge role={state.currentUser.role} />
              </div>
            </div>

            {/* Animated avatar */}
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center text-xs font-bold shadow-md shadow-blue-500/10 ring-2 ring-white hover:scale-105 transition-all duration-300 cursor-pointer">
              {getInitials(state.currentUser.name)}
            </div>
          </div>
        )}
      </div>

      {/* Tailwind animation definitions inline helper if needed, but we will add them in CSS */}
    </header>
  );
}
