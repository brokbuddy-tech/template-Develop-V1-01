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
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Menu, Building, Globe, Heart, ChevronDown } from 'lucide-react';
import { NAV_LINKS, SITE_NAME } from '@/lib/constants';
import { ScrollArea } from '../ui/scroll-area';
import type { NavLink } from '@/lib/types';

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <Building className="h-6 w-6 text-primary" />
    <span className="text-xl font-bold tracking-wide uppercase text-foreground">
      {SITE_NAME}
    </span>
  </Link>
);

const HoverDropdownMenu = ({ link }: { link: NavLink }) => {
  const [open, setOpen] = React.useState(false);

  if (!link.children) {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        onPointerEnter={() => setOpen(true)}
        onPointerLeave={() => setOpen(false)}
      >
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          {link.label}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
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
  <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
    {NAV_LINKS.map((link) =>
      link.children ? (
        <HoverDropdownMenu key={link.label} link={link} />
      ) : (
        <Link
          key={link.href}
          href={link.href}
          className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5"
        >
          {link.label === 'About Us' && <Globe className="h-4 w-4" />}
          {link.label}
        </Link>
      )
    )}
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
                  {link.label}
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
                  {link.label === 'About Us' && <Globe className="mr-2 h-5 w-5" />}
                  {link.label}
                </Link>
              </SheetClose>
            )
          )}
        </Accordion>
      </ScrollArea>
      <div className="mt-auto p-4 border-t space-y-4">
        <Button className="w-full font-semibold bg-gradient-to-r from-[#002B5B] to-[#C5A059] text-white hover:opacity-90 transition-opacity">
            Instant Vant Valuation
        </Button>
        <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" aria-label="Favorites">
                <Heart className="h-5 w-5 text-primary" />
            </Button>
            <LanguageSwitcher />
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

const LanguageSwitcher = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
        <Globe className="h-5 w-5 text-primary" />
        <span className="font-medium">EN</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>English</DropdownMenuItem>
      <DropdownMenuItem>العربية</DropdownMenuItem>
      <DropdownMenuItem>中文</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full shadow-sm bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <DesktopNav />
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Favorites">
              <Heart className="h-5 w-5 text-primary" />
            </Button>
            <LanguageSwitcher />
          </div>
          <Button className="hidden sm:inline-flex px-5 py-2 h-auto font-semibold text-sm bg-gradient-to-r from-[#002B5B] to-[#C5A059] text-white hover:opacity-90 transition-opacity rounded-md">
            Instant Vant Valuation
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
