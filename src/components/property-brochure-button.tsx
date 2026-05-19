'use client';

import {
  cloneElement,
  isValidElement,
  useMemo,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Building2, Loader2, Mail, MapPin, Phone } from 'lucide-react';

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

export function PropertyBrochureButton({ brochure, children }: BrochureButtonProps) {
  const [isPreparing, setIsPreparing] = useState(false);
  const gallery = useMemo(
    () => (brochure.gallery || []).filter(Boolean).slice(0, 4),
    [brochure.gallery],
  );
  const features = (brochure.features || []).filter(Boolean).slice(0, 8);
  const summary = truncateText(brochure.description || 'Property details available on request.', 900);

  const trigger = isValidElement(children) ? children : null;
  const triggerContent = trigger?.props?.children ?? null;
  const triggerDisabled = Boolean(trigger?.props?.disabled);

  function handleDownload(event: MouseEvent<HTMLElement>) {
    trigger?.props?.onClick?.(event);

    if (event.defaultPrevented || isPreparing || triggerDisabled) {
      return;
    }

    event.preventDefault();
    setIsPreparing(true);

    setTimeout(() => {
      window.print();
      setIsPreparing(false);
    }, 800);
  }

  return (
    <>
      {trigger ? cloneElement(trigger, {
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
      }) : null}

      <div
        id="develop-brochure-print-root"
        className="hidden print:block fixed inset-0 z-[99999] overflow-hidden bg-white text-slate-900"
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
                  position: fixed !important;
                  inset: 0 !important;
                  width: 210mm !important;
                  height: 297mm !important;
                  background: white !important;
                  z-index: 999999 !important;
                }
              }
            `,
          }}
        />

        <div className="flex h-[297mm] w-[210mm] flex-col overflow-hidden bg-white">
          <div className="flex items-center justify-between bg-slate-950 px-10 py-7 text-white">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.45em] text-slate-300">Public Listing</p>
              <h1 className="mt-3 text-[26px] font-bold tracking-tight">{brochure.title}</h1>
              {brochure.subtitle ? (
                <p className="mt-3 flex items-center gap-2 text-sm text-white/75">
                  <MapPin className="h-4 w-4 text-primary" />
                  {brochure.subtitle}
                </p>
              ) : null}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-right">
              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-white/60">Guide Price</p>
              <p className="mt-2 text-2xl font-bold text-white">{brochure.priceLabel}</p>
            </div>
          </div>

          <div className="relative h-[94mm] w-full bg-slate-100">
            {brochure.heroImage ? (
              <img
                src={brochure.heroImage}
                alt={brochure.title}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
          </div>

          <div className="grid flex-1 grid-cols-[1.55fr_0.9fr]">
            <div className="flex flex-col gap-8 px-10 py-8">
              {brochure.stats && brochure.stats.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {brochure.stats.slice(0, 3).map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">{stat.value}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {gallery.length > 1 ? (
                <div className="grid grid-cols-3 gap-3">
                  {gallery.slice(1).map((image, index) => (
                    <div key={`${image}-${index}`} className="h-[52mm] overflow-hidden rounded-2xl bg-slate-100">
                      <img
                        src={image}
                        alt={`${brochure.title} view ${index + 2}`}
                        className="h-full w-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                  ))}
                </div>
              ) : null}

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-primary">Property Overview</p>
                <p className="mt-4 whitespace-pre-line text-[11px] leading-6 text-slate-600">
                  {summary}
                </p>
              </div>

              {features.length > 0 ? (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-primary">Highlights</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {features.map((feature) => (
                      <div key={feature} className="rounded-xl bg-slate-50 px-4 py-3 text-[10px] font-semibold text-slate-600">
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col justify-between bg-slate-50 px-8 py-8">
              <div>
                <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-7 text-center shadow-sm">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {brochure.agentImage ? (
                      <img
                        src={brochure.agentImage}
                        alt={brochure.agentName || 'Listing specialist'}
                        className="h-full w-full rounded-full object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <Building2 className="h-9 w-9" />
                    )}
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-slate-900">
                    {brochure.agentName || 'Listing Specialist'}
                  </h2>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                    {brochure.agentTitle || 'Property Consultant'}
                  </p>
                </div>

                <div className="mt-8 space-y-5">
                  {brochure.company ? (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">Agency</p>
                      <p className="mt-2 text-sm font-semibold text-slate-700">{brochure.company}</p>
                    </div>
                  ) : null}
                  {brochure.contactPhone ? (
                    <div>
                      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">
                        <Phone className="h-3.5 w-3.5" />
                        Contact
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-700">{brochure.contactPhone}</p>
                    </div>
                  ) : null}
                  {brochure.contactEmail ? (
                    <div>
                      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">
                        <Mail className="h-3.5 w-3.5" />
                        Email
                      </p>
                      <p className="mt-2 break-all text-sm font-semibold text-slate-700">{brochure.contactEmail}</p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[24px] bg-slate-950 px-6 py-6 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/60">Advisory Note</p>
                <p className="mt-4 text-sm leading-6 text-white/85">
                  Generated from the live public feed so buyers can review key details and follow up faster with the listing team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
