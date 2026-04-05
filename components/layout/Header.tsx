"use client";

import { usePathname } from "next/navigation";
import { Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useRole } from "@/context/RoleContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/transactions": "Transactions",
  "/insights": "Insights",
  "/budget":"Budget"
};

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { role, setRole, isAdmin } = useRole();

  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 h-16 shrink-0">
      {/* Left — mobile menu + page title */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          title="hamburger button"
          className="md:hidden text-zinc-500"
          onClick={onMobileMenuToggle}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
            {title}
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:block">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Right — Role switcher + Theme toggle */}
      <div className="flex items-center gap-3">
        {/* Role Switcher — pill toggle */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full p-0.5 text-xs font-medium">
          {(["viewer", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r);
                toast.info(`Switched to ${r} mode`);
              }}
              className={cn(
                "px-3 py-1.5 rounded-full capitalize transition-all duration-200",
                role === r
                  ? "bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300",
              )}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Admin badge */}
        {isAdmin && (
          <span className="hidden sm:inline-flex text-xs font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
            Admin
          </span>
        )}

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
