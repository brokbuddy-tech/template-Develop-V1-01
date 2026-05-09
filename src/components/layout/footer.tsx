
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building, Send, Twitter, Linkedin, Instagram } from 'lucide-react';
import { FOOTER_LINKS, SITE_NAME } from '@/lib/constants';
import { getSiteConfig } from '@/lib/public-site';
import { prefixAgencyPath } from '@/lib/agency-routing';
import { getRequestAgencySlug } from '@/lib/server-agency';

const SocialLink = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
  <Link href={href} className="text-muted-foreground hover:text-foreground">
    <Icon className="h-5 w-5" />
  </Link>
);

export async function Footer() {
  const agencySlug = await getRequestAgencySlug();
  const siteConfig = await getSiteConfig(agencySlug);
  const displayName = siteConfig.branding?.displayName || siteConfig.organization.name || SITE_NAME;
  const officeAddress = siteConfig.profile?.officeAddress?.trim();
  const officeEmail = siteConfig.profile?.contact?.officialEmail || siteConfig.branding?.publicEmail;

  return (
    <footer className="border-t">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 pr-8">
            <Link href={prefixAgencyPath('/', agencySlug)} className="flex items-center gap-2 mb-4">
              <Building className="h-7 w-7 text-primary" />
              <span className="text-2xl font-bold tracking-tighter uppercase">{displayName}</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              {siteConfig.profile?.aboutCompany?.trim() || `Join ${displayName} for market insights and exclusive access.`}
            </p>
            {officeAddress ? <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">{officeAddress}</p> : null}
            <form className="flex gap-2">
              <Input type="email" placeholder="Your email address" className="flex-1" />
              <Button type="submit" size="icon" className="bg-primary text-primary-foreground">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={prefixAgencyPath(link.href, agencySlug)} className="text-sm text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {displayName}. All Rights Reserved.
          </p>
          <div className="text-sm text-muted-foreground">
            {officeEmail || officeAddress || 'Public agency website'}
          </div>
          <div className="flex items-center gap-4">
            <SocialLink href="#" icon={Twitter} />
            <SocialLink href="#" icon={Linkedin} />
            <SocialLink href="#" icon={Instagram} />
          </div>
        </div>
      </div>
    </footer>
  );
}
