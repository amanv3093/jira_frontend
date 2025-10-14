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
  { title: "Home", label: "", href: "/workspace", icon: <HomeIcon size={18} /> },
  { title: "My Tasks", label: "", href: "/task", icon: <UserCog size={18} /> },
  {
    title: "Settings",
    label: "",
    href: "/settings",
    icon: <Settings size={18} />,
  },
  { title: "Members", label: "", href: "/member", icon: <Users size={18} /> },
];


export  const getWorkspaceLinks = (workspaceId: string): SideLink[] => [
  { title: "Home", href: `/workspace/${workspaceId}`, icon: <HomeIcon size={18} /> },
  { title: "My Tasks", href: `/workspace/${workspaceId}/task`, icon: <UserCog size={18} /> },
  { title: "Settings", href: `/workspace/${workspaceId}/settings`, icon: <Settings size={18} /> },
  { title: "Members", href: `/workspace/${workspaceId}/member`, icon: <Users size={18} /> },
];


export const getNavigationLinks = (
  isProjectPage: boolean,
  projectId: string | null,
  workspaceId: string | null
): SideLink[] => {
  
  if (workspaceId) return getWorkspaceLinks(workspaceId);
  return [];
};
