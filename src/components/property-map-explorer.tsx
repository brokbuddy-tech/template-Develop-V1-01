'use client';

import { useEffect, useMemo, useState } from 'react';
import L, { type LatLngExpression, type LatLngTuple } from 'leaflet';
import Link from 'next/link';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import { useListingSearch } from '@/hooks/use-listing-search';
import { mapListingToProperty } from '@/lib/api';
import type { Property } from '@/lib/types';

type MappableProperty = Property & {
  latitude: number;
  longitude: number;
};

function createMarkerIcon(active = false) {
  return L.divIcon({
    className: '',
    html: `<span class="leaflet-property-marker${active ? ' is-active' : ''}"></span>`,
    iconSize: [18, 30],
    iconAnchor: [9, 30],
    popupAnchor: [0, -24],
  });
}

function FitMapToProperties({ positions }: { positions: LatLngTuple[] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;

    if (positions.length === 1) {
      map.setView(positions[0], 15, { animate: false });
      return;
    }

    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 15 });
  }, [map, positions]);

  return null;
}

function PanToSelection({ position }: { position: LatLngExpression | null }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;
    map.panTo(position, { animate: true });
  }, [map, position]);

  return null;
}

export function PropertyMapExplorer() {
  const { listings, meta, isLoading } = useListingSearch();
  const properties = useMemo<MappableProperty[]>(
    () => listings
      .map((listing: any): Property => mapListingToProperty(listing))
      .filter((property: Property): property is MappableProperty => property.latitude != null && property.longitude != null),
    [listings],
  );
  const [selectedId, setSelectedId] = useState<string | null>(properties[0]?.id ?? null);

  useEffect(() => {
    if (!properties.length) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !properties.some((property) => property.id === selectedId)) {
      setSelectedId(properties[0].id);
    }
  }, [properties, selectedId]);

  const selectedProperty = properties.find((property) => property.id === selectedId) ?? properties[0] ?? null;
  const selectedPosition = selectedProperty
    ? [selectedProperty.latitude, selectedProperty.longitude] as LatLngTuple
    : null;
  const positions = properties.map(
    (property) => [property.latitude, property.longitude] as LatLngTuple,
  );

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="h-[560px] animate-pulse rounded-2xl bg-muted" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-muted/35 px-6 py-14 text-center">
        <p className="text-xl font-semibold text-foreground">No mapped listings available yet</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Listings with saved latitude and longitude coordinates will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Map coverage
        </p>
        <p className="mt-2 text-base text-foreground">
          {properties.length} of {meta.total || properties.length} listings are ready for OpenStreetMap pins.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="leaflet-property-map overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="h-[560px] w-full">
            <MapContainer
              center={selectedPosition ?? positions[0]}
              zoom={13}
              className="h-full w-full"
              scrollWheelZoom={false}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ZoomControl position="bottomright" />
              <FitMapToProperties positions={positions} />
              <PanToSelection position={selectedPosition} />
              {properties.map((property) => (
                <Marker
                  key={property.id}
                  position={[property.latitude, property.longitude]}
                  icon={createMarkerIcon(property.id === selectedId)}
                  eventHandlers={{
                    click: () => setSelectedId(property.id),
                  }}
                >
                  <Popup>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">{property.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {property.mapAddress || property.location}
                      </p>
                      <p className="text-sm font-medium text-foreground">{property.price}</p>
                      <Link href={`/property/${property.id}`} className="text-xs font-semibold text-primary underline-offset-2 hover:underline">
                        View property
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="space-y-3 lg:max-h-[560px] lg:overflow-y-auto lg:pr-1">
          {properties.map((property) => (
            <div
              key={property.id}
              className={`rounded-2xl border px-5 py-4 transition ${
                property.id === selectedId
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-foreground hover:border-foreground/40'
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedId(property.id)}
                className="w-full text-left"
              >
                <p className="text-base font-semibold">{property.name}</p>
                <div className={`mt-2 flex items-center gap-2 text-sm ${property.id === selectedId ? 'text-background/80' : 'text-muted-foreground'}`}>
                  <MapPin className="h-4 w-4" />
                  <span>{property.mapAddress || property.location}</span>
                </div>
              </button>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-sm font-medium">{property.price}</p>
                <Link
                  href={`/property/${property.id}`}
                  className={`text-sm font-semibold ${property.id === selectedId ? 'text-background' : 'text-primary'}`}
                >
                  Open listing
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
