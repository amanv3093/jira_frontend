"use client";
import { useEffect, useState } from "react";
import useLocalStorage from "./use-localstorage";

const useIsCollapsed = () => {
  const [hydrated, setHydrated] = useState(false); // Track hydration state
  const [isCollapsed, setIsCollapsed] = useLocalStorage({
    key: "collapsed-sidebar",
    defaultValue: false,
  });

  useEffect(() => {
    // Once the component mounts, set hydrated to true
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return; // Ensure the effect only runs after hydration

    const handleResize = () => {
      // Update isCollapsed based on window.innerWidth
      setIsCollapsed(window.innerWidth < 768 ? false : isCollapsed);
    };

    // Initial setup
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isCollapsed, setIsCollapsed, hydrated]);

  // Only return isCollapsed once localStorage is fully loaded
  return hydrated
    ? ([isCollapsed, setIsCollapsed] as const)
    : ([false, () => {}] as const);
};

export default useIsCollapsed;
