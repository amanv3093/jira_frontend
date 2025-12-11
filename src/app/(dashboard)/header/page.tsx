"use client";
import React from "react";
// import { usePathname } from "next/navigation";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {  UserCog, UserCheck, LogOut, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
// import Profile from "./_components/profile";
// import ManageProjectDashboard from "../(managment)/manage-project/[id]/dashboard/_components/manage-project-dashboard";

const Header = () => {
  // const pathname = usePathname();
  // const isProjectPage = pathname.includes("/manage-project");
  const [open, setOpen] = React.useState(false);

  const [isDark, setIsDark] = React.useState(
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  const toggle = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <div className="shadow-sm flex justify-end p-4">
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="p-2 rounded hover:bg-gray-200 bg-gray-200 transition h-[30px] w-[30px] flex items-center justify-center"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="relative ">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-sm h-[30px] w-[30px]"
          >
            <div className="relative rounded-sm bg-gray-200 flex items-center justify-center overflow-hidden w-full h-full">
              <span className="text-gray-600 font-medium">J</span>
            </div>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded border z-50">
              <ul className="flex flex-col">
                <li
                  className={cn(
                    "p-2 hover:bg-gray-100 flex items-center gap-2"
                  )}
                >
                  <UserCog size={16} /> Profile Settings
                </li>
                <li
                  className={cn(
                    "p-2 hover:bg-gray-100 flex items-center gap-2"
                  )}
                >
                  <UserCheck size={16} /> My Tasks
                </li>
                <li
                  className={cn(
                    "p-2 hover:bg-gray-100 flex items-center gap-2"
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
