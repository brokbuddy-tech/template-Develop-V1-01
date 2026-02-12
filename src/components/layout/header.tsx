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
import { Menu, Building, Globe, DollarSign, ChevronDown } from 'lucide-react';
import { NAV_LINKS, SITE_NAME } from '@/lib/constants';

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <Building className="h-6 w-6 text-primary" />
    <span className="text-xl font-bold tracking-tighter uppercase">
      {SITE_NAME}
    </span>
  </Link>
);

const DesktopNav = () => (
  <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
    {NAV_LINKS.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        {link.label}
      </Link>
    ))}
  </nav>
);

const MobileNav = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon" className="md:hidden">
        <Menu />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <div className="flex flex-col gap-6 pt-6">
        <Logo />
        <nav className="grid gap-4">
          {NAV_LINKS.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </div>
    </SheetContent>
  </Sheet>
);

const LanguageCurrencySwitcher = () => (
  <div className="hidden md:flex items-center gap-2">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Globe />
          <span className="ml-2">EN</span>
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>English</DropdownMenuItem>
        <DropdownMenuItem>العربية</DropdownMenuItem>
        <DropdownMenuItem>中文</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <DollarSign />
          <span className="ml-2">AED</span>
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>AED</DropdownMenuItem>
        <DropdownMenuItem>USD</DropdownMenuItem>
        <DropdownMenuItem>EUR</DropdownMenuItem>
        <DropdownMenuItem>INR</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
          <DesktopNav />
        </div>

        <div className="flex items-center gap-2">
          <LanguageCurrencySwitcher />
          <Button className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90">
            List Your Property
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
