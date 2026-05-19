'use client';

import {
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Building2, CheckCircle2, Loader2, Mail, Phone } from 'lucide-react';
import { createPortal } from 'react-dom';

type BrochureStat = {
  label: string;
  value: string;
};

type BrochureButtonProps = {
  brochure: {
    title: string;
    subtitle?: string;
    priceLabel: string;
    description: string;
    heroImage?: string | null;
    gallery?: string[];
    stats?: BrochureStat[];
    features?: string[];
    agentName?: string;
    agentTitle?: string;
    agentImage?: string | null;
    company?: string | null;
    contactPhone?: string | null;
    contactEmail?: string | null;
  };
  children: ReactElement<{
    disabled?: boolean;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    type?: 'button' | 'submit' | 'reset';
    children?: ReactNode;
  }>;
};

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function waitForImageAsset(image: HTMLImageElement) {
  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      image.removeEventListener('load', finish);
      image.removeEventListener('error', finish);
      resolve();
    };

    image.addEventListener('load', finish, { once: true });
    image.addEventListener('error', finish, { once: true });

    if (typeof image.decode === 'function') {
      image.decode().then(finish).catch(() => undefined);
    }
  });
}

async function waitForBrochureAssets(rootId: string) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(images.map((image) => waitForImageAsset(image)));

  if ('fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font readiness failures and continue the export.
    }
  }

  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

export function PropertyBrochureButton({ brochure, children }: BrochureButtonProps) {
  const [isPreparing, setIsPreparing] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const gallery = useMemo(
    () => (brochure.gallery || []).filter(Boolean).slice(0, 6),
    [brochure.gallery],
  );
  const features = (brochure.features || []).filter(Boolean).slice(0, 8);
  const summary = truncateText(brochure.description || 'Property details available on request.', 900);
  const advisoryTitle = brochure.company || 'Public Listing Brochure';
  const contactName = brochure.agentName || 'Listing Specialist';
  const contactTitle = brochure.agentTitle || 'Property Consultant';

  const trigger = isValidElement(children) ? children : null;
  const triggerContent = trigger?.props?.children ?? null;
  const triggerDisabled = Boolean(trigger?.props?.disabled);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  function handleDownload(event: MouseEvent<HTMLElement>) {
    void startDownload(event);
  }

  async function startDownload(event: MouseEvent<HTMLElement>) {
    trigger?.props?.onClick?.(event);

    if (event.defaultPrevented || isPreparing || triggerDisabled) {
      return;
    }

    event.preventDefault();
    setIsPreparing(true);

    try {
      await waitForBrochureAssets('develop-brochure-print-root');
      await new Promise((resolve) => setTimeout(resolve, 150));
      window.print();
    } finally {
      setTimeout(() => setIsPreparing(false), 300);
    }
  }

  return (
    <>
      {trigger
        ? cloneElement(trigger, {
            disabled: isPreparing || triggerDisabled,
            onClick: handleDownload,
            type: trigger.props?.type ?? 'button',
            children: isPreparing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                PREPARING...
              </span>
            ) : (
              triggerContent
            ),
          })
        : null}

      {hasMounted
        ? createPortal(
            <div
              id="develop-brochure-print-root"
              aria-hidden="true"
              className="pointer-events-none fixed top-0 z-[-1] h-[297mm] w-[210mm] overflow-hidden bg-white text-black opacity-0 print:pointer-events-auto print:left-0 print:z-[99999] print:opacity-100"
              style={{ left: '-99999px' }}
            >
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                    @media print {
                      @page {
                        size: A4 portrait;
                        margin: 0 !important;
                      }
                      html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        overflow: hidden !important;
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                      }
                      body > *:not(#develop-brochure-print-root) {
                        display: none !important;
                      }
                      #develop-brochure-print-root {
                        display: block !important;
                        visibility: visible !important;
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        z-index: 999999 !important;
                        opacity: 1 !important;
                        pointer-events: auto !important;
                      }
                    }
                  `,
                }}
              />

              <div className="w-[210mm] h-[297mm] bg-white flex flex-col overflow-hidden shadow-none">
                <div className="relative h-[55%] w-full flex flex-col shrink-0">
                  <div className="flex h-[12%] w-full shrink-0">
                    <div className="bg-slate-100 flex-1 flex flex-col justify-center px-10">
                      <span className="text-[8px] font-bold tracking-[0.5em] text-black/30 uppercase mb-1">Public Listing</span>
                      <span className="text-xs font-bold tracking-[0.2em] text-black uppercase truncate">
                        {brochure.subtitle || 'Dubai, UAE'}
                      </span>
                    </div>
                    <div className="bg-slate-950 w-[35%] flex items-center justify-center px-6">
                      <div className="text-center">
                        <p className="text-[7px] font-bold tracking-[0.45em] uppercase text-white/35">Prepared By</p>
                        <p className="mt-2 text-[11px] font-bold tracking-[0.2em] uppercase text-white leading-tight">
                          {advisoryTitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex-grow bg-slate-100">
                    {brochure.heroImage ? (
                      <img
                        src={brochure.heroImage}
                        alt={brochure.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        crossOrigin="anonymous"
                        loading="eager"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />

                    {brochure.priceLabel ? (
                      <div className="absolute bottom-8 left-10 bg-slate-950/90 px-8 py-4 border-l-4 border-primary">
                        <p className="text-[8px] font-bold tracking-[0.45em] uppercase text-white/45">Guide Price</p>
                        <span className="mt-2 block text-white text-2xl font-bold tracking-[0.08em] uppercase">
                          {brochure.priceLabel}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex-grow w-full flex overflow-hidden">
                  <div className="flex-grow p-10 flex flex-col gap-8 overflow-hidden">
                    {brochure.stats && brochure.stats.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3 shrink-0">
                        {brochure.stats.slice(0, 3).map((stat) => (
                          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                            <p className="mt-2 text-lg font-bold text-slate-900">{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {gallery.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 aspect-[3/1.2] shrink-0">
                        {gallery.slice(0, 6).map((image, index) => (
                          <div key={`${image}-${index}`} className="relative w-full h-full bg-slate-100 overflow-hidden">
                            <img
                              src={image}
                              alt={`${brochure.title} view ${index + 1}`}
                              className="absolute inset-0 w-full h-full object-cover"
                              crossOrigin="anonymous"
                              loading="eager"
                            />
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {features.length > 0 ? (
                      <div className="space-y-4 shrink-0">
                        <div className="flex items-center gap-4">
                          <h3 className="text-[9px] font-bold tracking-[0.4em] uppercase text-black">Features & Amenities</h3>
                          <div className="h-px flex-grow bg-black/5" />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {features.map((feature) => (
                            <div key={feature} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-primary" />
                              <span className="text-[8.5px] font-bold uppercase tracking-widest text-black/60 truncate">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="space-y-4 flex-grow overflow-hidden">
                      <div className="flex items-center gap-4">
                        <h3 className="text-[9px] font-bold tracking-[0.4em] uppercase text-black">Property Overview</h3>
                        <div className="h-px flex-grow bg-black/5" />
                      </div>
                      <p className="text-[10px] leading-relaxed text-black/55 text-justify whitespace-pre-line line-clamp-[11]">
                        {summary}
                      </p>
                    </div>
                  </div>

                  <div className="w-[35%] bg-slate-950 p-10 flex flex-col justify-between text-white shrink-0">
                    <div className="space-y-10">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold tracking-[0.4em] uppercase text-white/65">Contact Specialist</h4>
                        <div className="w-8 h-px bg-white/20" />
                      </div>

                      <div className="rounded-[28px] border border-white/10 bg-white/5 px-6 py-6">
                        <div className="flex items-center gap-3 text-white/70">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                            {brochure.agentImage ? (
                              <img
                                src={brochure.agentImage}
                                alt={contactName}
                                className="h-full w-full rounded-full object-cover"
                                crossOrigin="anonymous"
                                loading="eager"
                              />
                            ) : (
                              <Building2 className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[7px] font-bold tracking-[0.4em] uppercase text-white/40">Advisor</p>
                            <p className="mt-1 text-base font-bold text-white truncate">{contactName}</p>
                          </div>
                        </div>
                        <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.25em] text-white/60">{contactTitle}</p>
                      </div>

                      <div className="space-y-6">
                        {brochure.company ? (
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-white/70 shrink-0">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/85 leading-snug">{brochure.company}</span>
                          </div>
                        ) : null}
                        {brochure.contactPhone ? (
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-white/70 shrink-0">
                              <Phone className="w-4 h-4" />
                            </div>
                            <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/85">{brochure.contactPhone}</span>
                          </div>
                        ) : null}
                        {brochure.contactEmail ? (
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-white/70 shrink-0">
                              <Mail className="w-4 h-4" />
                            </div>
                            <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/85 break-all">{brochure.contactEmail}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-white/5 px-6 py-6">
                      <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/55">Advisory Note</p>
                      <p className="mt-4 text-sm leading-6 text-white/80">
                        Generated from the live public feed so buyers can review key details and follow up faster with the listing team.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
