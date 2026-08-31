"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  LogOutIcon,
  SettingsIcon,
  X,
} from "lucide-react";
import { useAdmin } from "@/store/AdminContext";
import { menuConfig, ConfigIcon, siteConfig } from "@/global-config";
import { motion, AnimatePresence } from "framer-motion";

import { useGetSystemSettingsQuery } from "@/features/api/systemSettingsApi";

// Reusable Collapsible component animated with Framer Motion
function Collapsible({ children, isExpanded }) {
  return (
    <motion.div
      initial={false}
      animate={{
        height: isExpanded ? "auto" : 0,
        opacity: isExpanded ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
}

export default function AdminSidebar() {
  const { state, logout, isSidebarOpen, closeSidebar } = useAdmin();
  const pathname = usePathname();
  const { data: settingsResponse } = useGetSystemSettingsQuery();
  const settings = settingsResponse?.data || {};

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Normalize items list & filter out products disabled in System Settings
  const menuItems = React.useMemo(() => {
    const rawItems = menuConfig.flatMap((entry) => (entry.items ? entry.items : entry));

    return rawItems.map((item) => {
      if (item.id === "underwriting" && item.children) {
        const filteredChildren = item.children.filter((child) => {
          if (child.id === "uw-motor-vehicle" && settings.enable_motor_insurance === "false") {
            return false;
          }
          if (child.id === "uw-omp" && settings.enable_omp_insurance === "false") {
            return false;
          }
          if (child.id === "uw-personal-accident" && settings.enable_pa_insurance === "false") {
            return false;
          }
          return true;
        });
        return { ...item, children: filteredChildren };
      }
      return item;
    });
  }, [settings]);

  // Track expanded items - default to empty array (active route folders expanded automatically)
  const [expandedItems, setExpandedItems] = useState([]);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: isMobile ? "-100%" : 0 },
  };

  // Automatically expand folders containing the active route
  useEffect(() => {
    const activeIds = [];

    const checkItem = (item) => {
      const isMatched =
        item.href === pathname ||
        (item.href !== "/dashboard" && pathname.startsWith(item.href));
      if (isMatched) {
        activeIds.push(item.id);
      }
      if (item.children) {
        item.children.forEach((child) => {
          const childMatched =
            child.href === pathname || pathname.startsWith(child.href);
          if (childMatched) {
            activeIds.push(item.id);
            activeIds.push(child.id);
          }
          if (child.children) {
            child.children.forEach((gc) => {
              if (gc.href === pathname) {
                activeIds.push(item.id);
                activeIds.push(child.id);
                activeIds.push(gc.id);
              }
            });
          }
        });
      }
    };

    menuItems.forEach(checkItem);

    if (activeIds.length > 0) {
      setExpandedItems((prev) => {
        const unique = new Set([...prev, ...activeIds]);
        return Array.from(unique);
      });
    }
  }, [pathname, menuItems]);

  const toggleItem = (id) => {
    setExpandedItems((prev) => {
      // If already open, close it
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      // Find siblings at the same depth level
      const findSiblings = (tree) => {
        const topIds = tree.map((node) => node.id);
        if (topIds.includes(id)) {
          return topIds;
        }
        for (const node of tree) {
          if (node.children) {
            const childIds = node.children.map((c) => c.id);
            if (childIds.includes(id)) {
              return childIds;
            }
            const deepSiblings = findSiblings(node.children);
            if (deepSiblings.length > 0) return deepSiblings;
          }
        }
        return [];
      };

      const siblingIds = findSiblings(menuItems);
      const filtered = prev.filter((itemId) => !siblingIds.includes(itemId));
      return [...filtered, id];
    });
  };

  // Check if a path is active
  const isPathActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  // Helper to check if any child/grandchild of a menu item is active
  const isAnyChildActive = (item) => {
    if (item.href && isPathActive(item.href)) return true;
    if (item.children) {
      return item.children.some((child) => {
        if (child.href && isPathActive(child.href)) return true;
        if (child.children) {
          return child.children.some((gc) => gc.href && isPathActive(gc.href));
        }
        return false;
      });
    }
    return false;
  };

  return (
    <>
      {/* Backdrop for Mobile overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            onClick={closeSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar container */}
      <motion.aside
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
        className="fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col z-50 shrink-0 select-none shadow-xl"
      >
        {/* Header/Logo */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            {settings.logo ? (
              <img
                src={settings.logo}
                alt="Company Logo"
                className="w-9 h-9 object-contain rounded-xl bg-white p-1 shadow-lg shadow-blue-500/10 ring-1 ring-white/20"
              />
            ) : (
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/35 ring-1 ring-blue-400/40">
                <ConfigIcon
                  name={siteConfig.logo.icon}
                  className="w-5 h-5 text-white"
                />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-bold text-xs text-white leading-tight tracking-wide truncate">
                {settings.company_name || siteConfig.logo.text}
              </h2>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                {siteConfig.logo.subText}
              </p>
            </div>
          </div>

          {/* Close button inside mobile menu */}
          <button
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 custom-scrollbar">
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const itemExpanded = expandedItems.includes(item.id);
            const isSelected = hasChildren
              ? isAnyChildActive(item)
              : isPathActive(item.href);

            const itemButtonContent = (
              <>
                <span
                  className={`transition-transform duration-200 ${isSelected
                      ? "scale-105 text-white"
                      : "text-slate-300 group-hover:scale-110 group-hover:text-white"
                    }`}
                >
                  <ConfigIcon name={item.icon} className="w-4 h-4" />
                </span>
                <span className="flex-1 text-left font-medium">{item.label}</span>
                {hasChildren && (
                  <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
                    {itemExpanded ? (
                      <ChevronDownIcon className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRightIcon className="w-3.5 h-3.5" />
                    )}
                  </span>
                )}
              </>
            );

            return (
              <div key={item.id} className="space-y-0.5">
                {/* Level 1 Item */}
                {hasChildren ? (
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group cursor-pointer
                      ${isSelected
                        ? "bg-slate-800 text-white shadow-sm ring-1 ring-slate-700/50"
                        : "text-slate-200 hover:text-white hover:bg-slate-800/60"
                      }
                    `}
                  >
                    {itemButtonContent}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group relative
                      ${isSelected
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-bold"
                        : "text-slate-200 hover:text-white hover:bg-slate-800/60"
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-white rounded-r-md" />
                    )}
                    {itemButtonContent}
                  </Link>
                )}

                {/* Level 2: Children (Sub-menus) */}
                {hasChildren && (
                  <Collapsible isExpanded={itemExpanded}>
                    <div className="space-y-1 mt-1 ml-3.5 pl-3 border-l border-slate-700/50">
                      {item.children.map((child) => {
                        const childHasChildren =
                          child.children && child.children.length > 0;
                        const childExpanded = expandedItems.includes(child.id);
                        const childSelected = childHasChildren
                          ? isAnyChildActive(child)
                          : isPathActive(child.href);

                        const childButtonContent = (
                          <>
                            <span className="flex-1 text-left">
                              {child.label}
                            </span>
                            {childHasChildren && (
                              <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
                                {childExpanded ? (
                                  <ChevronDownIcon className="w-3 h-3" />
                                ) : (
                                  <ChevronRightIcon className="w-3 h-3" />
                                )}
                              </span>
                            )}
                          </>
                        );

                        return (
                          <div key={child.id} className="space-y-0.5">
                            {childHasChildren ? (
                              <button
                                onClick={() => toggleItem(child.id)}
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-[12px] font-medium tracking-wide transition-all duration-200 group cursor-pointer
                                  ${childSelected
                                    ? "text-white bg-slate-800/80 font-semibold"
                                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                                  }
                                `}
                              >
                                {childButtonContent}
                              </button>
                            ) : (
                              <Link
                                href={child.href}
                                onClick={closeSidebar}
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-[12px] font-medium tracking-wide transition-all duration-200 group relative
                                  ${childSelected
                                    ? "text-blue-400 font-bold bg-blue-500/15 border-l-2 border-blue-500"
                                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                                  }
                                `}
                              >
                                {childButtonContent}
                              </Link>
                            )}

                            {/* Level 3: Child-Child (Grandchildren) */}
                            {childHasChildren && (
                              <Collapsible isExpanded={childExpanded}>
                                <div className="space-y-1 mt-1 ml-3 pl-3 border-l border-slate-700/40">
                                  {child.children.map((grandchild) => {
                                    const grandchildSelected =
                                      isPathActive(grandchild.href);

                                    return (
                                      <Link
                                        key={grandchild.id}
                                        href={grandchild.href}
                                        onClick={closeSidebar}
                                        className={`w-full flex items-center px-3 py-1.5 rounded-md text-[11px] font-medium tracking-wide transition-all duration-150 group relative
                                        ${grandchildSelected
                                            ? "text-blue-400 font-bold bg-blue-500/10"
                                            : "text-slate-300 hover:text-white hover:bg-slate-800/30"
                                          }
                                      `}
                                      >
                                        <span>{grandchild.label}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </Collapsible>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Collapsible>
                )}
              </div>
            );
          })}
        </nav>

        {/* User profile details & Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          {state.currentUser && (
            <div className="flex items-center gap-3 mb-3.5 px-2 py-1 bg-slate-900/80 rounded-xl border border-slate-800/80">
              <div className="w-8 h-8 bg-blue-600/30 border border-blue-500/40 rounded-lg flex items-center justify-center text-xs font-bold text-blue-300">
                {state.currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-100 truncate">
                  {state.currentUser.name}
                </p>
                <p className="text-[10px] text-blue-400 capitalize font-medium truncate">
                  {state.currentUser.role.replace(/_/g, " ")}
                </p>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            {/* <Link
              href="/settings"
              onClick={closeSidebar}
              className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              Settings
            </Link> */}
            <button
              onClick={() => {
                closeSidebar();
                logout();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 cursor-pointer"
            >
              <LogOutIcon className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
