"use client";
import React from "react";
import { useTheme } from "next-themes";
import { UserCog, UserCheck, LogOut, Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <div className="shadow-sm dark:shadow-border/20 flex justify-end p-4 bg-background">
      <div className="flex items-center gap-2">
        <button
          onClick={cycleTheme}
          className="p-2 rounded-md hover:bg-muted bg-muted/60 transition h-[30px] w-[30px] flex items-center justify-center text-foreground"
          title={`Theme: ${theme}`}
        >
          {themeIcon()}
        </button>
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-sm h-[30px] w-[30px]"
          >
            <div className="relative rounded-sm bg-muted flex items-center justify-center overflow-hidden w-full h-full">
              <span className="text-muted-foreground font-medium">J</span>
            </div>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-popover text-popover-foreground shadow-lg rounded border border-border z-50">
              <ul className="flex flex-col">
                <li
                  className={cn(
                    "p-2 hover:bg-muted flex items-center gap-2 cursor-pointer"
                  )}
                >
                  <UserCog size={16} /> Profile Settings
                </li>
                <li
                  className={cn(
                    "p-2 hover:bg-muted flex items-center gap-2 cursor-pointer"
                  )}
                >
                  <UserCheck size={16} /> My Tasks
                </li>
                <li
                  className={cn(
                    "p-2 hover:bg-muted flex items-center gap-2 cursor-pointer"
                  )}
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
