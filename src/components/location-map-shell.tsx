'use client';

import dynamic from 'next/dynamic';

type LocationMapProps = {
    latitude?: number | null;
    longitude?: number | null;
    locationLabel?: string;
    addressLabel?: string;
};

const DynamicLocationMap = dynamic(
    () => import('@/components/location-map').then((mod) => ({ default: mod.LocationMap })),
    {
        ssr: false,
        loading: () => <div className="h-96 w-full rounded-xl border border-border bg-card/50" />,
    }
);

export function LocationMapShell(props: LocationMapProps) {
    return <DynamicLocationMap {...props} />;
}
