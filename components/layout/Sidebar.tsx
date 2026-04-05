"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navLinks = [
  { href: "/",              label: "Dashboard",    icon: LayoutDashboard },
  { href: "/transactions",  label: "Transactions", icon: ArrowLeftRight  },
  { href: "/insights",      label: "Insights",     icon: Lightbulb       },
  { href: "/budget",       label: "Budget",       icon: Target          }, 
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

export default function Sidebar({ collapsed, onToggle, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-2 px-4 py-5 border-b border-zinc-200 dark:border-zinc-800",
        collapsed && "justify-center px-0"
      )}>
        <Wallet className="w-6 h-6 text-violet-600 shrink-0" />
        {!collapsed && (
          <span className="font-bold text-base text-zinc-800 dark:text-zinc-100 tracking-tight">
          Finio
          </span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1 p-2 mt-2 flex-1">
        <TooltipProvider delayDuration={0}>
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                     onClick={onNavigate} 
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                </TooltipTrigger>
                {/* Only show tooltip when collapsed */}
                {collapsed && (
                  <TooltipContent side="right">
                    {label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-violet-600 transition-colors shadow-sm"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}