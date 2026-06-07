'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Menu, Settings, ChevronDown } from 'lucide-react';
import { NAV_LINKS, SITE_NAME } from '@/lib/constants';
import { ScrollArea } from '../ui/scroll-area';
import type { NavLink } from '@/lib/types';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { getSiteConfig, hasMeaningfulSiteConfig, type SiteConfig } from '@/lib/public-site';
import { prefixAgencyPath, resolveAgencySlugFromPathname } from '@/lib/agency-routing';

const DevelopLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 21V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 21V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Logo = ({
  brandName,
  agencySlug,
  logoUrl,
}: {
  brandName: string;
  agencySlug?: string | null;
  logoUrl?: string | null;
}) => (
  <Link href={prefixAgencyPath('/', agencySlug)} className="flex items-center gap-2">
    {logoUrl ? (
      <span className="relative h-9 w-9 overflow-hidden rounded-md border border-border bg-card">
        <Image
          src={logoUrl}
          alt={`${brandName} logo`}
          fill
          className="object-contain p-1"
          sizes="36px"
        />
      </span>
    ) : (
      <DevelopLogo />
    )}
    <span className="text-xl font-bold tracking-wide uppercase text-foreground">
      {brandName}
    </span>
  </Link>
);

const isHrefActive = (pathname: string, href: string) => {
  const hrefPath = href.split('?')[0] || '/';
  return pathname === hrefPath || (hrefPath !== '/' && pathname.startsWith(`${hrefPath}/`));
};

const isNavLinkActive = (pathname: string, agencySlug: string | null | undefined, link: NavLink) => {
  if (isHrefActive(pathname, prefixAgencyPath(link.href, agencySlug))) {
    return true;
  }

  return link.children?.some((child) => isHrefActive(pathname, prefixAgencyPath(child.href, agencySlug))) ?? false;
};

const HoverDropdownMenu = ({
  link,
  agencySlug,
  isActive,
}: {
  link: NavLink;
  agencySlug?: string | null;
  isActive?: boolean;
}) => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const linkHref = prefixAgencyPath(link.href, agencySlug);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(linkHref);
  };
  
  if (!link.children) {
    return (
      <Button asChild variant="ghost" className={cn("relative z-10 font-semibold text-sm", isActive && "text-foreground")}>
        <Link
          href={linkHref}
          aria-current={isActive ? 'page' : undefined}
          className={cn("text-muted-foreground transition-colors hover:text-foreground p-2", isActive && "text-foreground")}
        >
          {link.label}
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <div
        className="flex items-center"
        onPointerEnter={() => setOpen(true)}
        onPointerLeave={() => setOpen(false)}
      >
        <Button
          variant="ghost"
          className={cn("relative z-10 font-semibold text-sm p-2 pr-1", isActive && "text-foreground")}
          aria-current={isActive ? 'page' : undefined}
          onClick={handleButtonClick}
        >
            {link.label}
        </Button>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="p-1 h-auto w-auto focus-visible:ring-0 focus-visible:ring-offset-0">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent
        align="start"
        onPointerEnter={() => setOpen(true)}
        onPointerLeave={() => setOpen(false)}
      >
        {link.children.map((child) => (
          <DropdownMenuItem key={child.href} asChild>
            <Link href={prefixAgencyPath(child.href, agencySlug)}>{child.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DesktopNav = ({
  agencySlug,
  pathname,
}: {
  agencySlug?: string | null;
  pathname: string;
}) => {
  const navRef = React.useRef<HTMLElement | null>(null);
  const itemRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const activeLink = NAV_LINKS.find((link) => isNavLinkActive(pathname, agencySlug, link));
  const activeKey = activeLink?.label;
  const [activeUnderline, setActiveUnderline] = React.useState<{ left: number; width: number } | null>(null);

  React.useEffect(() => {
    const updateUnderline = () => {
      if (!activeKey || !navRef.current) {
        setActiveUnderline(null);
        return;
      }

      const activeItem = itemRefs.current[activeKey];
      if (!activeItem) {
        setActiveUnderline(null);
        return;
      }

      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      setActiveUnderline({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
      });
    };

    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [activeKey]);

  return (
    <nav ref={navRef} className="relative hidden lg:flex items-center gap-2 pb-1 text-sm font-semibold">
      {activeUnderline && (
        <span
          className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-primary transition-all duration-300 ease-out"
          style={{
            left: activeUnderline.left,
            width: activeUnderline.width,
          }}
        />
      )}
      {NAV_LINKS.map((link) => (
        <div
          key={link.label}
          ref={(node) => {
            itemRefs.current[link.label] = node;
          }}
        >
          <HoverDropdownMenu
            link={link}
            agencySlug={agencySlug}
            isActive={link.label === activeKey}
          />
        </div>
      ))}
    </nav>
  );
};

const MobileNav = ({
  agencySlug,
  brandName,
  logoUrl,
}: {
  agencySlug?: string | null;
  brandName: string;
  logoUrl?: string | null;
}) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon" className="lg:hidden">
        <Menu />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-full max-w-sm flex flex-col p-0">
      <div className="p-6 pb-0">
        <Logo brandName={brandName} agencySlug={agencySlug} logoUrl={logoUrl} />
      </div>
      <ScrollArea className="flex-1 my-4">
        <Accordion type="multiple" className="w-full px-6">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <AccordionItem value={link.label} key={link.label} className="border-b-0">
                <AccordionTrigger className="py-3 text-lg font-medium text-muted-foreground hover:no-underline hover:text-foreground">
                  <SheetClose asChild>
                    <Link href={prefixAgencyPath(link.href, agencySlug)}>{link.label}</Link>
                  </SheetClose>
                </AccordionTrigger>
                <AccordionContent>
                  <nav className="grid gap-2 py-2 pl-4">
                    {link.children.map((child) => (
                      <SheetClose asChild key={child.href}>
                        <Link
                          href={prefixAgencyPath(child.href, agencySlug)}
                          className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </AccordionContent>
              </AccordionItem>
            ) : (
              <SheetClose asChild key={link.href}>
                <Link
                  href={prefixAgencyPath(link.href, agencySlug)}
                  className="flex items-center py-3 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground border-b mx-6"
                >
                  {link.label}
                </Link>
              </SheetClose>
            )
          )}
        </Accordion>
      </ScrollArea>
      <div className="mt-auto p-4 border-t space-y-4">
        <Button asChild className="w-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity">
            <Link href={prefixAgencyPath('/contact', agencySlug)}>Contact Us</Link>
        </Button>
        <div className="flex items-center justify-center gap-4">
            <UtilitySwitcher />
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

const UtilitySwitcher = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
        <Settings className="h-5 w-5 text-primary" />
        <span className="font-medium">EN</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Language</DropdownMenuLabel>
      <DropdownMenuItem>English</DropdownMenuItem>
      <DropdownMenuItem>العربية</DropdownMenuItem>
      <DropdownMenuItem>中文</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Currency</DropdownMenuLabel>
      <DropdownMenuItem>AED</DropdownMenuItem>
      <DropdownMenuItem>USD</DropdownMenuItem>
      <DropdownMenuItem>EUR</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export function Header({ initialSiteConfig }: { initialSiteConfig?: SiteConfig | null }) {
  const pathname = usePathname();
  const agencySlug = resolveAgencySlugFromPathname(pathname);
  const [brandName, setBrandName] = React.useState(
    initialSiteConfig?.branding?.displayName || initialSiteConfig?.organization.name || SITE_NAME,
  );
  const [brandLogo, setBrandLogo] = React.useState<string | null>(initialSiteConfig?.profile?.logo || null);

  React.useEffect(() => {
    setBrandName(initialSiteConfig?.branding?.displayName || initialSiteConfig?.organization.name || SITE_NAME);
    setBrandLogo(initialSiteConfig?.profile?.logo || null);
  }, [initialSiteConfig]);

  React.useEffect(() => {
    let active = true;

    async function loadSiteConfig() {
      try {
        const siteConfig = await getSiteConfig(agencySlug);
        if (!active) return;
        if (!hasMeaningfulSiteConfig(siteConfig)) return;
        setBrandName(siteConfig.branding?.displayName || siteConfig.organization.name || SITE_NAME);
        setBrandLogo(siteConfig.profile?.logo || null);
      } catch {
        if (!active) return;
        setBrandName((current) => current || initialSiteConfig?.branding?.displayName || initialSiteConfig?.organization.name || SITE_NAME);
        setBrandLogo((current) => current || initialSiteConfig?.profile?.logo || null);
      }
    }

    void loadSiteConfig();
    return () => {
      active = false;
    };
  }, [agencySlug, initialSiteConfig]);

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm bg-background border-b">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        <div className="flex items-center gap-6 lg:w-1/4">
          <Logo brandName={brandName} agencySlug={agencySlug} logoUrl={brandLogo} />
        </div>
        <div className="flex-1 flex justify-center">
          <DesktopNav agencySlug={agencySlug} pathname={pathname} />
        </div>
        <div className="flex items-center justify-end gap-2 md:gap-4 lg:w-1/4">
          <div className="hidden lg:flex items-center gap-2">
            <UtilitySwitcher />
          </div>
          <Button asChild className="hidden sm:inline-flex px-5 py-2 h-auto font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity rounded-none">
            <Link href={prefixAgencyPath('/contact', agencySlug)}>Contact Us</Link>
          </Button>
          <MobileNav agencySlug={agencySlug} brandName={brandName} logoUrl={brandLogo} />
        </div>
      </div>
    </header>
  );
}
