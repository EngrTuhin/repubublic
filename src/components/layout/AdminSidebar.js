"use client";

import React, { useState, useEffect, useRef } from "react";
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

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track expanded sections, parent items, and child items
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
    menuConfig.forEach((section) => {
      section.items.forEach((item) => {
        const isMatched =
          item.href === pathname ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        if (isMatched) {
          activeIds.push(section.id);
          activeIds.push(item.id);
        }
        if (item.children) {
          item.children.forEach((child) => {
            const childMatched =
              child.href === pathname || pathname.startsWith(child.href);
            if (childMatched) {
              activeIds.push(section.id);
              activeIds.push(item.id);
              activeIds.push(child.id);
            }
            if (child.children) {
              child.children.forEach((gc) => {
                const gcMatched = gc.href === pathname;
                if (gcMatched) {
                  activeIds.push(section.id);
                  activeIds.push(item.id);
                  activeIds.push(child.id);
                }
              });
            }
          });
        }
      });
    });

    if (activeIds.length > 0) {
      setExpandedItems((prev) => {
        const unique = new Set([...prev, ...activeIds]);
        return Array.from(unique);
      });
    }
  }, [pathname]);

  const toggleItem = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
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
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar container */}
      <motion.aside
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
        className="fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col z-50"
      >
        {/* Header/Logo */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/35 ring-1 ring-blue-400/30">
              <ConfigIcon
                name={siteConfig.logo.icon}
                className="w-5 h-5 text-white"
              />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white leading-tight">
                {siteConfig.logo.text}
              </h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {siteConfig.logo.subText}
              </p>
            </div>
          </div>

          {/* Close button inside mobile menu */}
          <button
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-4 custom-scrollbar">
          {menuConfig.map((section) => {
            const sectionExpanded = expandedItems.includes(section.id);

            return (
              <div key={section.id} className="space-y-1">
                {/* Category Header */}
                <button
                  onClick={() => toggleItem(section.id)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-200 rounded-lg hover:bg-slate-880/20 transition-all duration-150 group cursor-pointer"
                >
                  <span>{section.title}</span>
                  {sectionExpanded ? (
                    <ChevronDownIcon className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  ) : (
                    <ChevronRightIcon className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  )}
                </button>

                {/* Sub-navigation items (Level 1: Parents) */}
                <Collapsible isExpanded={sectionExpanded}>
                  <div className="space-y-0.5 mt-1">
                    {section.items.map((item) => {
                      const hasChildren =
                        item.children && item.children.length > 0;
                      const itemExpanded = expandedItems.includes(item.id);
                      const isSelected = hasChildren
                        ? isAnyChildActive(item)
                        : isPathActive(item.href);

                      const itemButtonContent = (
                        <>
                          <span
                            className={`transition-transform duration-200 ${isSelected ? "scale-100 text-white" : "text-slate-400 group-hover:scale-110 group-hover:text-slate-200"}`}
                          >
                            <ConfigIcon
                              name={item.icon}
                              className="w-4.5 h-4.5"
                            />
                          </span>
                          <span className="flex-1 text-left">{item.label}</span>
                          {hasChildren && (
                            <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
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
                          {/* Parent Item */}
                          {hasChildren ? (
                            <button
                              onClick={() => toggleItem(item.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group cursor-pointer
                                ${
                                  isSelected
                                    ? "bg-slate-800/60 text-white"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/30"
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
                                ${
                                  isSelected
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15 font-semibold"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                                }
                              `}
                            >
                              {isSelected && (
                                <div className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r-md" />
                              )}
                              {itemButtonContent}
                            </Link>
                          )}

                          {/* Level 2: Children (Sub-menus) */}
                          {hasChildren && (
                            <Collapsible isExpanded={itemExpanded}>
                              <div className="space-y-0.5 mt-0.5">
                                {item.children.map((child) => {
                                  const childHasChildren =
                                    child.children && child.children.length > 0;
                                  const childExpanded = expandedItems.includes(
                                    child.id,
                                  );
                                  const childSelected = childHasChildren
                                    ? isAnyChildActive(child)
                                    : isPathActive(child.href);

                                  const childButtonContent = (
                                    <>
                                      <span className="flex-1 text-left">
                                        {child.label}
                                      </span>
                                      {childHasChildren && (
                                        <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
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
                                          className={`w-full flex items-center pl-10 pr-3 py-2 rounded-lg text-[11px] font-semibold tracking-wide transition-all duration-200 group cursor-pointer
                                            ${
                                              childSelected
                                                ? "text-slate-100 bg-slate-800/30"
                                                : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/10"
                                            }
                                          `}
                                        >
                                          {childButtonContent}
                                        </button>
                                      ) : (
                                        <Link
                                          href={child.href}
                                          onClick={closeSidebar}
                                          className={`w-full flex items-center pl-10 pr-3 py-2 rounded-lg text-[11px] font-semibold tracking-wide transition-all duration-200 group relative
                                            ${
                                              childSelected
                                                ? "text-blue-400 font-bold bg-blue-500/10"
                                                : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/15"
                                            }
                                          `}
                                        >
                                          {childSelected && (
                                            <div className="absolute left-[30px] top-2 bottom-2 w-1 bg-blue-500 rounded-r-sm" />
                                          )}
                                          {childButtonContent}
                                        </Link>
                                      )}

                                      {/* Level 3: Child-Child (Grandchildren) */}
                                      {childHasChildren && (
                                        <Collapsible isExpanded={childExpanded}>
                                          <div className="space-y-0.5">
                                            {child.children.map(
                                              (grandchild) => {
                                                const grandchildSelected =
                                                  isPathActive(grandchild.href);

                                                return (
                                                  <Link
                                                    key={grandchild.id}
                                                    href={grandchild.href}
                                                    onClick={closeSidebar}
                                                    className={`w-full flex items-center pl-15 pr-3 py-1.5 rounded-md text-[10px] font-medium tracking-wide transition-all duration-150 group relative
                                                    ${
                                                      grandchildSelected
                                                        ? "text-blue-400 font-bold"
                                                        : "text-slate-500 hover:text-slate-350"
                                                    }
                                                  `}
                                                  >
                                                    {grandchildSelected && (
                                                      <div className="absolute left-[48px] top-1.5 bottom-1.5 w-1 bg-blue-400 rounded-r-sm" />
                                                    )}
                                                    <span>
                                                      {grandchild.label}
                                                    </span>
                                                  </Link>
                                                );
                                              },
                                            )}
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
                  </div>
                </Collapsible>
              </div>
            );
          })}
        </nav>

        {/* User profile details & Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          {state.currentUser && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-xs font-bold text-slate-200 shadow-inner">
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
                <p className="text-[10px] text-slate-400 capitalize font-medium mt-0.5 truncate">
                  {state.currentUser.role.replace(/_/g, " ")}
                </p>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <Link
              href="/settings"
              onClick={closeSidebar}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded-xl transition-all duration-200"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              Settings
            </Link>
            <button
              onClick={() => {
                closeSidebar();
                logout();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 cursor-pointer"
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
