
'use client';

import * as React from 'react';
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
import { useRouter } from 'next/navigation';

const DevelopLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 21V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 21V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <DevelopLogo />
    <span className="text-xl font-bold tracking-wide uppercase text-foreground">
      {SITE_NAME}
    </span>
  </Link>
);

const HoverDropdownMenu = ({ link }: { link: NavLink }) => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(link.href);
  };
  
  if (!link.children) {
    return (
      <Button asChild variant="ghost" className="font-semibold text-sm">
        <Link
          href={link.href}
          className="text-muted-foreground transition-colors hover:text-foreground p-2"
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
        <Button variant="ghost" className="font-semibold text-sm p-2 pr-1" onClick={handleButtonClick}>
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
            <Link href={child.href}>{child.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DesktopNav = () => (
  <nav className="hidden lg:flex items-center gap-2 text-sm font-semibold">
    {NAV_LINKS.map((link) => <HoverDropdownMenu key={link.label} link={link} />)}
  </nav>
);

const MobileNav = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon" className="lg:hidden">
        <Menu />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-full max-w-sm flex flex-col p-0">
      <div className="p-6 pb-0">
        <Logo />
      </div>
      <ScrollArea className="flex-1 my-4">
        <Accordion type="multiple" className="w-full px-6">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <AccordionItem value={link.label} key={link.label} className="border-b-0">
                <AccordionTrigger className="py-3 text-lg font-medium text-muted-foreground hover:no-underline hover:text-foreground">
                  <SheetClose asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </SheetClose>
                </AccordionTrigger>
                <AccordionContent>
                  <nav className="grid gap-2 py-2 pl-4">
                    {link.children.map((child) => (
                      <SheetClose asChild key={child.href}>
                        <Link
                          href={child.href}
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
                  href={link.href}
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
            <Link href="/instant-valuation">Instant Valuation</Link>
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

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full shadow-sm bg-background border-b">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        <div className="flex items-center gap-6 lg:w-1/4">
          <Logo />
        </div>
        <div className="flex-1 flex justify-center">
          <DesktopNav />
        </div>
        <div className="flex items-center justify-end gap-2 md:gap-4 lg:w-1/4">
          <div className="hidden lg:flex items-center gap-2">
            <UtilitySwitcher />
          </div>
          <Button asChild className="hidden sm:inline-flex px-5 py-2 h-auto font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity rounded-none">
            <Link href="/instant-valuation">Instant Valuation</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
