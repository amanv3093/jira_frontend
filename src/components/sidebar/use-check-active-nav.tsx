"use client";

import { usePathname } from "next/navigation";

export default function useCheckActiveNav() {
  const pathname = usePathname();

  const checkActiveNav = (nav: string) => {
    if (!pathname) return false;

    if (nav === "/") return pathname === "/";

    if (pathname === nav) return true;

    const isWorkspaceRoot = /^\/workspace\/[^/]+$/.test(nav);
    if (isWorkspaceRoot) return false;

    // otherwise allow nested matches
    return pathname.startsWith(nav + "/");
  };

  return { checkActiveNav };
}
