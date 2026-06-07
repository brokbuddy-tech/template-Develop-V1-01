import type { Metadata } from 'next';
import React from 'react';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/providers';
import { getAgencyDisplayName, getSiteConfig } from '@/lib/public-site';
import { getRequestAgencySlug } from '@/lib/server-agency';

export async function generateMetadata(): Promise<Metadata> {
  const agencySlug = await getRequestAgencySlug();
  const siteConfig = await getSiteConfig(agencySlug);
  const agencyName = getAgencyDisplayName(siteConfig);
  const logoIconUrl = siteConfig.profile?.logo?.trim() || undefined;

  return {
    title: siteConfig.branding?.metaTitle || `${agencyName} | Redefining Real Estate in Dubai`,
    description:
      siteConfig.branding?.metaDescription
      || `${agencyName} is an ultra-premium, minimalist, and data-driven luxury real estate platform.`,
    icons: logoIconUrl
      ? {
          icon: [{ url: logoIconUrl }],
          shortcut: [{ url: logoIconUrl }],
          apple: [{ url: logoIconUrl }],
        }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const agencySlug = await getRequestAgencySlug();
  const siteConfig = await getSiteConfig(agencySlug);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <Header initialSiteConfig={siteConfig} />
          <main className="flex-1">{children}</main>
          <Footer agencySlug={agencySlug} initialSiteConfig={siteConfig} />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
