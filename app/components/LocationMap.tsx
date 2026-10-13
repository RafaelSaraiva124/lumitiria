"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

const LUMITIRIA_COORDS: [number, number] = [41.3739422, -8.5448419];

export default function LocationMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: LeafletMap | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let cancelled = false;

    (async () => {
      const { default: L } = await import("leaflet");

      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, {
        center: LUMITIRIA_COORDS,
        zoom: 16,
        scrollWheelZoom: false,
      });

        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }
        ).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: '<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#f5f3ee;border:2px solid #1c2620;box-shadow:0 0 0 4px rgba(245,243,238,0.2)"></span>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      L.marker(LUMITIRIA_COORDS, { icon })
        .addTo(map)
        .bindPopup(
          "<strong>Lumitiria</strong><br />Rua do Comércio Lote 30<br />4760-739 Vilarinho das Cambas"
        );

      resizeObserver = new ResizeObserver(() => map?.invalidateSize());
      resizeObserver.observe(containerRef.current);

      requestAnimationFrame(() => map?.invalidateSize());
    })();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      map?.remove();
    };
  }, []);

  return (
    <div className="relative isolate z-0 h-[360px] w-full overflow-hidden rounded-2xl md:h-full">
      <div ref={containerRef} className="absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: "#1c2620", mixBlendMode: "color" }}
      />
    </div>
  );
}
