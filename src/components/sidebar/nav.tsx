import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import useCheckActiveNav from "./use-check-active-nav";
import { SideLink } from "@/constants/sidelinks";

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  links: SideLink[];
  closeNav: () => void;
}

export default function Nav({
  links,
  isCollapsed,
  className,
  closeNav,
}: NavProps) {
  const renderLink = ({ sub, ...rest }: SideLink) => {
    const key = `${rest.title}-${rest.href}`;
    if (isCollapsed && sub)
      return (
        <NavLinkIconDropdown
          {...rest}
          sub={sub}
          key={key}
          closeNav={closeNav}
        />
      );

    if (isCollapsed)
      return <NavLinkIcon {...rest} key={key} closeNav={closeNav} />;

    if (sub)
      return (
        <NavLinkDropdown {...rest} sub={sub} key={key} closeNav={closeNav} />
      );

    return <NavLink {...rest} key={key} closeNav={closeNav} />;
  };

  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        "group transition-all duration-200 ease-out",
        className
      )}
    >
      <TooltipProvider delayDuration={0}>
        <nav
          className={cn(
            "flex flex-col gap-0.5",
            isCollapsed ? "items-center px-1.5" : "px-3"
          )}
        >
          {links.map(renderLink)}
        </nav>
      </TooltipProvider>
    </div>
  );
}

interface NavLinkProps extends SideLink {
  subLink?: boolean;
  closeNav: () => void;
}

function NavLink({
  title,
  icon,
  label,
  href,
  closeNav,
  subLink = false,
}: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav();
  const isActive = checkActiveNav(href);

  return (
    <Link
      href={href}
      onClick={closeNav}
      className={cn(
        "group/link flex h-8 items-center gap-2.5 rounded-md px-2 text-[13px] transition-colors duration-150",
        subLink && "ml-4 h-7 border-l border-border pl-3 text-xs",
        isActive
          ? "bg-accent font-medium text-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <span
        className={cn(
          "shrink-0 [&>svg]:h-4 [&>svg]:w-4",
          isActive ? "text-foreground" : "text-muted-foreground/80"
        )}
      >
        {icon}
      </span>
      <span className="truncate">{title}</span>
      {label && (
        <span className="ml-auto rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {label}
        </span>
      )}
    </Link>
  );
}

function NavLinkDropdown({ title, icon, label, sub, closeNav }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav();
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href));

  return (
    <Collapsible defaultOpen={isChildActive}>
      <CollapsibleTrigger
        className={cn(
          "group/trigger flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-[13px] transition-colors duration-150",
          isChildActive
            ? "bg-accent font-medium text-foreground"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
        )}
      >
        <span
          className={cn(
            "shrink-0 [&>svg]:h-4 [&>svg]:w-4",
            isChildActive ? "text-foreground" : "text-muted-foreground/80"
          )}
        >
          {icon}
        </span>
        <span className="truncate">{title}</span>
        {label && (
          <span className="ml-1 rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {label}
          </span>
        )}
        <ChevronDown
          size={14}
          className={cn(
            "ml-auto shrink-0 text-muted-foreground/60 transition-transform duration-200",
            "group-data-[state=open]/trigger:rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden transition-all duration-200 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="mt-0.5 space-y-0.5">
          {sub!.map((sublink) => (
            <NavLink key={sublink.title} {...sublink} subLink closeNav={closeNav} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function NavLinkIcon({ title, icon, label, href }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav();
  const isActive = checkActiveNav(href);

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150",
            isActive
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
          )}
        >
          <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
          <span className="sr-only">{title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={8}
        className="rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground shadow-md"
      >
        {title}
        {label && (
          <span className="ml-1.5 text-muted-foreground">({label})</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

function NavLinkIconDropdown({ title, icon, label, sub }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav();
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href));

  return (
    <DropdownMenu>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150",
                isChildActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={8}
          className="rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground shadow-md"
        >
          {title}
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={8}
        className="min-w-[180px] rounded-lg border border-border p-1"
      >
        <DropdownMenuLabel className="px-2 py-1 text-xs font-semibold text-muted-foreground">
          {title}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sub!.map(({ title, icon, label, href }) => (
          <DropdownMenuItem key={`${title}-${href}`} asChild>
            <Link
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                checkActiveNav(href)
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
              <span className="truncate">{title}</span>
              {label && (
                <span className="ml-auto text-[10px] text-muted-foreground">
                  {label}
                </span>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
