//nav
import Link  from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Button, buttonVariants } from './custom/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import useCheckActiveNav from "./use-check-active-nav";
import { SideLink } from "@/constants/sidelinks";

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean
  links: SideLink[]
  closeNav: () => void
}

export default function Nav({
  links,
  isCollapsed,
  className,
  closeNav,
}: NavProps) {
  const renderLink = ({ sub, ...rest }: SideLink) => {
    const key = `${rest.title}-${rest.href}`
    if (isCollapsed && sub)
      return (
        <NavLinkIconDropdown
          {...rest}
          sub={sub}
          key={key}
          closeNav={closeNav}
        />
      )

    if (isCollapsed)
      return <NavLinkIcon {...rest} key={key} closeNav={closeNav} />

    if (sub)
      return (
        <NavLinkDropdown {...rest} sub={sub} key={key} closeNav={closeNav} />
      )

    return <NavLink {...rest} key={key} closeNav={closeNav} />
  }
  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        'group border-b bg-background py-2 transition-all duration-300 ease-in-out data-[collapsed=true]:py-2 md:border-none',
        className
      )}
    >
      <TooltipProvider delayDuration={0}>
        <nav className='grid gap-1.5 px-4 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
          {links.map(renderLink)}
        </nav>
      </TooltipProvider>
    </div>
  )
}

interface NavLinkProps extends SideLink {
  subLink?: boolean
  closeNav: () => void
}

function NavLink({
  title,
  icon,
  label,
  href,
  closeNav,
  subLink = false,
}: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()
  return (
    <Link
      href={href}
      onClick={closeNav}
      className={cn(
        buttonVariants({
          variant: checkActiveNav(href) ? 'secondary' : 'ghost',
          size: 'sm',
        }),
        'h-11 justify-start text-wrap rounded-lg px-4 transition-all duration-200 hover:bg-primary/10',
        checkActiveNav(href) && 'bg-primary/15 font-medium text-primary hover:bg-primary/20',
        subLink && 'h-10 w-full border-l-2 border-l-primary/20 px-3 text-sm'
      )}
      aria-current={checkActiveNav(href) ? 'page' : undefined}
    >
      <div className='mr-3 text-primary/80'>{icon}</div>
      <span className="font-medium">{title}</span>
      {label && (
        <div className='ml-auto rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
          {label}
        </div>
      )}
    </Link>
  )
}

function NavLinkDropdown({ title, icon, label, sub, closeNav }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href))

  return (
    <Collapsible defaultOpen={isChildActive}>
      <CollapsibleTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'group h-11 w-full justify-start rounded-lg px-4 transition-all duration-200 hover:bg-primary/10',
          isChildActive && 'bg-primary/15 font-medium text-primary hover:bg-primary/20'
        )}
      >
        <div className='mr-3 text-primary/80'>{icon}</div>
        <span className="font-medium">{title}</span>
        {label && (
          <div className='ml-2 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
            {label}
          </div>
        )}
        <ChevronDown 
          className={cn(
            'ml-auto h-4 w-4 transition-transform duration-200',
            'group-data-[state=open]:-rotate-180'
          )}
          stroke="2"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className='overflow-hidden transition-all duration-200'>
        <ul className='mt-1 space-y-1'>
          {sub!.map((sublink) => (
            <li key={sublink.title} className='ml-6'>
              <NavLink {...sublink} subLink closeNav={closeNav} />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

function NavLinkIcon({ title, icon, label, href }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            buttonVariants({
              variant: checkActiveNav(href) ? 'secondary' : 'ghost',
              size: 'icon',
            }),
            'h-11 w-11 rounded-lg transition-all duration-200',
            checkActiveNav(href) && 'bg-primary/15 text-primary hover:bg-primary/20'
          )}
        >
          <div className="text-black">{icon}</div>
          <span className='sr-only'>{title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side='right' className='flex items-center gap-4 rounded-lg border border-primary/10 bg-background/95 px-3 py-2 backdrop-blur text-black'>
        <span className="font-medium">{title}</span>
        {label && (
          <span className='rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>{label}</span>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

function NavLinkIconDropdown({ title, icon, label, sub }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href))

  return (
    <DropdownMenu>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant={isChildActive ? 'secondary' : 'ghost'}
              size='icon'
              className={cn(
                'h-11 w-11 rounded-lg transition-all duration-200',
                isChildActive && 'bg-primary/15 text-primary hover:bg-primary/20'
              )}
            >
              <div className="text-black">{icon}</div>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side='right' className='flex items-center gap-4 rounded-lg border border-primary/10 bg-background/95 px-3 py-2 backdrop-blur text-black'>
          <span className="font-medium">{title}</span>
          {label && (
            <span className='rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>{label}</span>
          )}
          <ChevronDown size={16} className='-rotate-90 text-primary/60' />
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side='right' align='start' sideOffset={4} className="min-w-48">
        <DropdownMenuLabel className="font-medium">
          {title} {label && <span className="text-xs text-primary/60">({label})</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sub!.map(({ title, icon, label, href }) => (
          <DropdownMenuItem key={`${title}-${href}`} asChild>
            <Link
              href={href}
              className={cn(
                'flex w-full items-center rounded-md px-2 py-1.5 transition-colors duration-200',
                checkActiveNav(href) ? 'bg-primary/15 text-primary' : 'hover:bg-primary/10'
              )}
            >
              <span className="text-black">{icon}</span>
              <span className='ml-2 flex-1 truncate font-medium'>{title}</span>
              {label && <span className='ml-2 rounded-md bg-primary/10 px-1.5 py-0.5 text-xs text-primary'>{label}</span>}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
