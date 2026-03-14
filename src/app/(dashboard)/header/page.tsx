"use client";
import React, { useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { UserCog, UserCheck, LogOut, Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const workspaceId = pathname?.split("/")[2] || null;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const themeIcon = () => {
    if (!mounted) return <Moon size={18} />;
    if (theme === "dark") return <Sun size={18} />;
    if (theme === "system") return <Monitor size={18} />;
    return <Moon size={18} />;
  };

  const user = session?.user;
  const initials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || "U"
    : "U";

  return (
    <div className="shadow-sm dark:shadow-border/20 flex justify-end p-4 bg-background">
      <div className="flex items-center gap-2">
        <button
          onClick={cycleTheme}
          className="p-2 rounded-md hover:bg-muted bg-muted/60 transition h-[30px] w-[30px] flex items-center justify-center text-foreground"
          title={mounted ? `Theme: ${theme}` : undefined}
        >
          {themeIcon()}
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-full"
          >
            <Avatar className="h-[30px] w-[30px]">
              {(user as any)?.avatarUrl ? (
                <AvatarImage src={(user as any).avatarUrl} alt="Profile" />
              ) : null}
              <AvatarFallback className="text-xs font-semibold bg-muted text-muted-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-popover text-popover-foreground shadow-lg rounded-lg border border-border z-50 py-1">
              <ul className="flex flex-col">
                <li
                  className="px-3 py-2 hover:bg-muted flex items-center gap-2 cursor-pointer text-sm transition-colors"
                  onClick={() => {
                    setOpen(false);
                    if (workspaceId) router.push(`/workspace/${workspaceId}/profile`);
                  }}
                >
                  <UserCog size={16} /> Profile Settings
                </li>
                <li
                  className="px-3 py-2 hover:bg-muted flex items-center gap-2 cursor-pointer text-sm transition-colors"
                  onClick={() => {
                    setOpen(false);
                    if (workspaceId) router.push(`/workspace/${workspaceId}/task`);
                  }}
                >
                  <UserCheck size={16} /> My Tasks
                </li>
                <li className="my-1 border-t border-border" />
                <li
                  className="px-3 py-2 hover:bg-muted flex items-center gap-2 cursor-pointer text-sm text-red-600 dark:text-red-400 transition-colors"
                  onClick={() => signOut({ callbackUrl: "/sign-in", redirect: true })}
                >
                  <LogOut size={16} /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
