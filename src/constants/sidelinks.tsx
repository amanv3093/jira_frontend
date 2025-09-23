import {
  Users2,
  UserCheck,
  UserCog,
  HomeIcon,
  Warehouse,
  Settings,
  Layers,
  Users,
} from "lucide-react";

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: React.ReactNode;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

const mainLinks: SideLink[] = [
  { title: "Home", label: "", href: "/", icon: <HomeIcon size={18} /> },
  { title: "My Tasks", label: "", href: "/tasks", icon: <UserCog size={18} /> },
  {
    title: "Settings",
    label: "",
    href: "/settings",
    icon: <Settings size={18} />,
  },
  { title: "Members", label: "", href: "/members", icon: <Users size={18} /> },
];

const getProjectLinks = (projectId: string): SideLink[] => [
  {
    title: "Project Overview",
    href: `/projects/${projectId}`,
    icon: <Warehouse size={18} />,
  },
  {
    title: "Project Settings",
    href: `/projects/${projectId}/settings`,
    icon: <Settings size={18} />,
  },
];

export const getNavigationLinks = (
  isProjectPage: boolean,
  projectId: string | null
): SideLink[] => {
  if (isProjectPage && projectId) return getProjectLinks(projectId);
  return mainLinks;
};
