"use client";

import React, { useState } from "react";
import type { Station } from "@/lib/stations";

export type AlertCountsByStation = Record<
  string,
  { total: number; byType: Record<string, number> }
>;

function hexToRgba(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

interface LineDiagramProps {
  stations: Station[];
  currentStationId: string | null;
  lineColor?: string;
  alertCountsByStation?: AlertCountsByStation;
  alertLabels?: Record<string, string>;
  alertTypeIcons?: Record<string, React.ReactNode>;
}

export function LineDiagram({
  stations,
  currentStationId,
  lineColor = "#A61361",
  alertCountsByStation = {},
  alertLabels = {},
  alertTypeIcons = {},
}: LineDiagramProps) {
  const [popupStation, setPopupStation] = useState<Station | null>(null);
  const shadow = lineColor.startsWith("#")
    ? `0 0 20px -4px ${hexToRgba(lineColor, 0.4)}`
    : undefined;
  const stationData = popupStation
    ? alertCountsByStation[popupStation.name]
    : null;

  return (
    <React.Fragment>
      {popupStation && stationData && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xl"
          onClick={() => setPopupStation(null)}
        >
          <div
            className="relative z-[10000] w-full max-w-sm rounded-2xl border border-zinc-200/80 bg-white shadow-2xl overflow-hidden ring-4 ring-white/20"
            style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-5 pt-5 pb-4"
              style={{ borderBottom: `3px solid ${lineColor}` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 leading-tight">
                    {popupStation.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    {stationData.total}{" "}
                    {stationData.total === 1 ? "alerta" : "alertas"} nesta estação
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPopupStation(null)}
                  className="shrink-0 rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
                  aria-label="Fechar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <ul className="p-4 space-y-2">
              {Object.entries(stationData.byType)
                .filter(([, n]) => n > 0)
                .map(([type, count]) => (
                  <li
                    key={type}
                    className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-colors"
                    style={{
                      backgroundColor: hexToRgba(lineColor, 0.08),
                      borderLeft: `4px solid ${lineColor}`,
                    }}
                  >
                    <span className="flex items-center gap-3 text-sm font-semibold text-zinc-800">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ backgroundColor: hexToRgba(lineColor, 0.2) }}
                      >
                        <span style={{ color: lineColor }}>
                          {alertTypeIcons[type]}
                        </span>
                      </span>
                      {alertLabels[type] ?? type}
                    </span>
                    <span
                      className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 font-bold tabular-nums text-sm text-white"
                      style={{ backgroundColor: lineColor }}
                    >
                      {count}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
      <div className="w-full max-w-full overflow-x-hidden flex justify-center">
        <div className="relative flex flex-col items-center py-2 w-full max-w-[20rem]">
          <div
            className="absolute top-0 bottom-0 w-6 rounded-full z-0"
            style={{
              backgroundColor: lineColor,
              boxShadow: shadow,
              left: "50%",
              transform: "translateX(-50%)",
            }}
            aria-hidden
          />
          {stations.map((station, index) => {
            const isCurrent = station.id === currentStationId;
            const nameOnLeft = index % 2 === 0;
            const counts = alertCountsByStation[station.name];
            const hasAlerts = counts && counts.total > 0;

            return (
              <div
                key={station.id}
                className={`relative z-10 flex items-center justify-center gap-2 py-2 min-h-[2.75rem] w-full ${
                  hasAlerts ? "cursor-pointer" : ""
                }`}
                onClick={() => hasAlerts && setPopupStation(station)}
                role={hasAlerts ? "button" : undefined}
              >
                <div
                  className={`min-w-0 flex-1 flex flex-col ${
                    nameOnLeft
                      ? "items-end text-right pr-2"
                      : "items-start text-left pl-2"
                  }`}
                >
                  {nameOnLeft && (
                    <>
                      {hasAlerts && counts && (
                        <span
                          className="shrink-0 min-w-[1.25rem] h-5 px-1 rounded-md text-white text-[0.65rem] font-bold flex items-center justify-center mb-0.5"
                          style={{ backgroundColor: lineColor }}
                        >
                          {counts.total}
                        </span>
                      )}
                      {isCurrent ? (
                        <span
                          className="inline-flex px-2.5 py-1 rounded-full bg-white border border-zinc-300 text-xs font-semibold leading-tight truncate max-w-full"
                          style={{ color: lineColor }}
                        >
                          {station.name}
                        </span>
                      ) : (
                        <span className="block text-xs leading-tight truncate max-w-full text-zinc-700/80">
                          {station.name}
                        </span>
                      )}
                    </>
                  )}
                </div>
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  title={station.name}
                  aria-current={isCurrent ? "true" : undefined}
                >
                  <span
                    className={`block rounded-full bg-white border-2 transition-all ${
                      isCurrent
                        ? "h-5 w-5 md:h-6 md:w-6 shadow-[0_0_0_4px_rgba(255,255,255,0.4)]"
                        : "h-3.5 w-3.5 md:h-4 md:w-4"
                    }`}
                    style={{ borderColor: lineColor }}
                  />
                </div>
                <div
                  className={`min-w-0 flex-1 flex flex-col ${
                    !nameOnLeft
                      ? "items-start text-left pl-2"
                      : "items-end text-right pr-2"
                  }`}
                >
                  {!nameOnLeft && (
                    <>
                      {hasAlerts && counts && (
                        <span
                          className="shrink-0 min-w-[1.25rem] h-5 px-1 rounded-md text-white text-[0.65rem] font-bold flex items-center justify-center mb-0.5"
                          style={{ backgroundColor: lineColor }}
                        >
                          {counts.total}
                        </span>
                      )}
                      {isCurrent ? (
                        <span
                          className="inline-flex px-2.5 py-1 rounded-full bg-white border border-zinc-300 text-xs font-semibold leading-tight truncate max-w-full"
                          style={{ color: lineColor }}
                        >
                          {station.name}
                        </span>
                      ) : (
                        <span className="block text-xs leading-tight truncate max-w-full text-zinc-700/80">
                          {station.name}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
}
