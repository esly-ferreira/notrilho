"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useFooterVisibility } from "@/app/FooterVisibilityProvider";
import { FloatingAlertMenu } from "@/components/FloatingAlertMenu";
import { LineDiagram } from "@/components/LineDiagram";
import { LINE_7_STATIONS, LINE_8_STATIONS, LINE_9_STATIONS, LINE_10_STATIONS, LINE_11_STATIONS, LINE_12_STATIONS, LINE_13_STATIONS } from "@/lib/stations";
import type { Station } from "@/lib/stations";
import { findNearestStation } from "@/utils/findNearestStation";

type LocationStatus = "loading" | "success" | "error" | "denied";

export type SentAlertRecord = {
  optionLabel: string;
  stationName: string | null;
  sentAt: Date;
  lineId?: string | null;
};

/** Cache em memória: evita nova requisição ao trocar de tela; só busca de novo ao atualizar a página. */
let alertsCache: SentAlertRecord[] | null = null;

const LINES = [
  { id: "line-7", name: "Linha 7 Rubi", color: "#A61361", badge: "7", label: "Linha 7 Rubi", stations: LINE_7_STATIONS, description: "Jundiaí a Barra Funda", stat: `${LINE_7_STATIONS.length} estações` },
  { id: "line-8", name: "Linha 8 Diamante", color: "#AFA690", badge: "8", label: "Linha 8 Diamante", stations: LINE_8_STATIONS, description: "Amador Bueno a Júlio Prestes", stat: `${LINE_8_STATIONS.length} estações` },
  { id: "line-9", name: "Linha 9 Esmeralda", color: "#34AEA4", badge: "9", label: "Linha 9 Esmeralda", stations: LINE_9_STATIONS, description: "Osasco a Varginha", stat: `${LINE_9_STATIONS.length} estações` },
  { id: "line-10", name: "Linha 10 Turquesa", color: "#0089B1", badge: "10", label: "Linha 10 Turquesa", stations: LINE_10_STATIONS, description: "Luz a Rio Grande da Serra", stat: `${LINE_10_STATIONS.length} estações` },
  { id: "line-11", name: "Linha 11 Coral", color: "#FB4529", badge: "11", label: "Linha 11 Coral", stations: LINE_11_STATIONS, description: "Palmeiras-Barra Funda a Estudantes", stat: `${LINE_11_STATIONS.length} estações` },
  { id: "line-12", name: "Linha 12 Safira", color: "#3C2377", badge: "12", label: "Linha 12 Safira", stations: LINE_12_STATIONS, description: "Brás a Calmon Viana", stat: `${LINE_12_STATIONS.length} estações` },
  { id: "line-13", name: "Linha 13 Jade", color: "#00AE3D", badge: "13", label: "Linha 13 Jade", stations: LINE_13_STATIONS, description: "Engenheiro Goulart a Aeroporto - Guarulhos", stat: `${LINE_13_STATIONS.length} estações` },
] as const;

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function darkenHex(hex: string, factor: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
}

const ALERT_LABELS: Record<string, string> = {
  LOTADO: "Lotação",
  "TREM PARADO": "Trem parado",
  ATRASO: "Atraso",
  NORMAL: "Normal",
};

const ALERT_STATUS_MESSAGE: Record<string, { withReports: string; noReports: string }> = {
  LOTADO: {
    withReports: "Há relatos de superlotação no horário.",
    noReports: "Nenhum relato de superlotação no momento.",
  },
  "TREM PARADO": {
    withReports: "Há relatos de trem parado.",
    noReports: "Nenhum relato de trem parado no momento.",
  },
  ATRASO: {
    withReports: "Há relatos de atraso no horário.",
    noReports: "Nenhum relato de atraso no momento.",
  },
  NORMAL: {
    withReports: "Operação normal reportada no horário.",
    noReports: "Nenhum relato de operação normal recente.",
  },
};

function countByType(alerts: SentAlertRecord[]) {
  const counts: Record<string, number> = {};
  for (const a of alerts) {
    counts[a.optionLabel] = (counts[a.optionLabel] ?? 0) + 1;
  }
  return counts;
}

function countByLine(alerts: SentAlertRecord[]) {
  const counts: Record<string, number> = {};
  for (const a of alerts) {
    const id = a.lineId ?? "outros";
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}

function getAlertCountsByStation(alerts: SentAlertRecord[], lineId: string | null) {
  const filtered = lineId ? alerts.filter((a) => a.lineId === lineId) : alerts;
  const byStation: Record<string, { total: number; byType: Record<string, number> }> = {};
  for (const a of filtered) {
    const sn = a.stationName ?? "Não informada";
    if (!byStation[sn]) byStation[sn] = { total: 0, byType: {} };
    byStation[sn].total += 1;
    byStation[sn].byType[a.optionLabel] = (byStation[sn].byType[a.optionLabel] ?? 0) + 1;
  }
  return byStation;
}

function groupAlertsByTypeAndLine(alerts: SentAlertRecord[]) {
  const groups: { lineId: string | null; optionLabel: string; count: number; stations: Record<string, number>; latestSentAt: Date }[] = [];
  const seen = new Map<string, { count: number; stations: Record<string, number>; latestSentAt: Date }>();
  for (const a of alerts) {
    const key = `${a.lineId ?? "outros"}|${a.optionLabel}`;
    if (!seen.has(key)) {
      seen.set(key, { count: 0, stations: {}, latestSentAt: a.sentAt });
    }
    const g = seen.get(key)!;
    g.count += 1;
    if (a.sentAt > g.latestSentAt) g.latestSentAt = a.sentAt;
    const sn = a.stationName ?? "Não informada";
    g.stations[sn] = (g.stations[sn] ?? 0) + 1;
  }
  for (const [key, data] of Array.from(seen.entries())) {
    const [lineId, optionLabel] = key.split("|");
    groups.push({
      lineId: lineId === "outros" ? null : lineId,
      optionLabel,
      count: data.count,
      stations: data.stations,
      latestSentAt: data.latestSentAt,
    });
  }
  return groups.sort((a, b) => b.count - a.count);
}

function formatTimeAgo(date: Date) {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return "agora";
  const min = Math.floor(sec / 60);
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  return `há ${h}h`;
}

//hora destravad
// function isWithinAlertWindow(date: Date = new Date()) {
//   const minutes = date.getHours() * 60 + date.getMinutes();
//   const start = 4 * 60 + 40; // 04:40
//   // Até 00:00 (fim do dia), ou seja, qualquer horário >= 04:40
//   return minutes >= start;
// }

function isWithinAlertWindow(_date: Date = new Date()) {
  // Horário destravado temporariamente: permite alertas em qualquer hora do dia
  return true;
}

function LoadingScreen() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
      <p className="mt-4 text-sm font-medium text-zinc-600">Carregando...</p>
    </main>
  );
}

const ALERT_TYPE_ICONS: Record<string, ReactNode> = {
  LOTADO: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  "TREM PARADO": <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>,
  ATRASO: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  NORMAL: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m22 4-10 10-4-4" /></svg>,
};

export default function Home() {
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [manualStation, setManualStation] = useState<Station | null>(null);
  const [status, setStatus] = useState<LocationStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [alertsSent, setAlertsSent] = useState<SentAlertRecord[]>([]);
  const [showAlertCounts, setShowAlertCounts] = useState(false);
  const [notificationLineFilter, setNotificationLineFilter] = useState<string>("all");
  const [toast, setToast] = useState<{ type: "info" | "error"; message: string } | null>(null);
  const [pendingAlerts, setPendingAlerts] = useState<
    { optionLabel: string; stationName: string | null; lineId: string | null }[]
  >([]);
  const [bellHighlight, setBellHighlight] = useState(false);
  const [initialDataReady, setInitialDataReady] = useState(false);
  const [refreshingAlerts, setRefreshingAlerts] = useState(false);

  const lineConfig = LINES.find((l) => l.id === selectedLine);
  const stations = lineConfig?.stations ?? LINE_7_STATIONS;
  const effectiveStation = manualStation ?? currentStation;
  const { setHideFooter } = useFooterVisibility();

  useEffect(() => {
    setHideFooter(selectedLine !== null);
    return () => setHideFooter(false);
  }, [selectedLine, setHideFooter]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const minDelay = 400;
    const start = Date.now();
    const markReady = () => {
      if (cancelled) return;
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minDelay - elapsed);
      timeoutId = setTimeout(() => setInitialDataReady(true), remaining);
    };

    if (alertsCache !== null) {
      setAlertsSent(alertsCache);
      markReady();
      return () => {
        cancelled = true;
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    fetch("/api/alerts")
      .then((res) => res.json())
      .then((list: { optionLabel: string; stationName: string | null; sentAt: string; lineId: string | null }[]) => {
        if (cancelled || !Array.isArray(list)) return;
        const mapped = list.map((a) => ({
          optionLabel: a.optionLabel,
          stationName: a.stationName,
          sentAt: new Date(a.sentAt),
          lineId: a.lineId,
        }));
        setAlertsSent(mapped);
        alertsCache = mapped;
      })
      .catch(() => {})
      .finally(markReady);
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (alertsSent.length > 0) alertsCache = alertsSent;
  }, [alertsSent]);

  const refreshAlerts = () => {
    setRefreshingAlerts(true);
    fetch("/api/alerts")
      .then((res) => res.json())
      .then((list: { optionLabel: string; stationName: string | null; sentAt: string; lineId: string | null }[]) => {
        if (!Array.isArray(list)) return;
        const mapped = list.map((a) => ({
          optionLabel: a.optionLabel,
          stationName: a.stationName,
          sentAt: new Date(a.sentAt),
          lineId: a.lineId,
        }));
        setAlertsSent(mapped);
        alertsCache = mapped;
      })
      .catch(() => {})
      .finally(() => setRefreshingAlerts(false));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const audio = new Audio("/images/sounds/bell.mp3");
      audio.volume = 0.5;
      void audio.play().catch(() => {});
    } catch {
      // ignora erro de áudio
    }
    setBellHighlight(true);
    const id = setTimeout(() => setBellHighlight(false), 1200);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!toast || toast.type !== "error") return;
    try {
      const audio = new Audio("/sounds/error.mp3");
      audio.volume = 0.6;
      void audio.play().catch(() => {});
    } catch {
      // ignora erro de áudio
    }
  }, [toast]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleOnline = async () => {
      if (pendingAlerts.length === 0) return;
      const toSend = [...pendingAlerts];
      setPendingAlerts([]);
      setToast({
        type: "info",
        message: `Sua conexão voltou. Enviando ${toSend.length} alerta(s) pendente(s).`,
      });
      for (const pending of toSend) {
        try {
          await fetch("/api/alerts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lineId: pending.lineId,
              stationName: pending.stationName,
              alertType: pending.optionLabel,
            }),
          });
        } catch {
          // se falhar de novo, recoloca o restante na fila e para
          setPendingAlerts((prev) => [...prev, pending, ...toSend.slice(toSend.indexOf(pending) + 1)]);
          break;
        }
      }
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [pendingAlerts]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePopState = () => {
      if (selectedLine !== null) {
        setSelectedLine(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedLine]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedLine !== null) {
      window.history.pushState({ selectedLine }, "", window.location.href);
    }
  }, [selectedLine]);

  useEffect(() => {
    if (selectedLine === null || typeof window === "undefined") return;
    setStatus("loading");
    setCurrentStation(null);
    setManualStation(null);
    const lineConfig = LINES.find((l) => l.id === selectedLine);
    const stationsToUse = lineConfig?.stations ?? LINE_7_STATIONS;
    const getLocation = () => {
      if (!navigator.geolocation) {
        setStatus("error");
        setErrorMessage("Geolocalização não é suportada neste navegador.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearest = findNearestStation(latitude, longitude, stationsToUse);
          setCurrentStation(nearest);
          setStatus("success");
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setStatus("denied");
            setErrorMessage("Permissão de localização negada.");
          } else {
            setStatus("error");
            setErrorMessage(error.message || "Não foi possível obter sua localização.");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    };
    const timer = setTimeout(getLocation, 800);
    return () => clearTimeout(timer);
  }, [selectedLine]);

  if (selectedLine === null) {
    if (!initialDataReady) {
      return <LoadingScreen />;
    }
    return (
      <main className="min-h-screen flex flex-col items-center px-4 py-8 overflow-x-hidden bg-white">
        <header className="w-full max-w-md flex items-center justify-between gap-3 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            Notrilho
          </h1>
          <button
            type="button"
            onClick={refreshAlerts}
            disabled={refreshingAlerts}
            className="shrink-0 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {refreshingAlerts ? (
              <>
                <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-zinc-300 border-t-zinc-600 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
                Atualizar
              </>
            )}
          </button>
        </header>
        {alertsSent.length > 0 && (
          <section className="w-full max-w-md mb-6 flex flex-col min-h-0 max-h-[50vh]">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 shrink-0">Notificações</h3>
            <p className="text-xs text-zinc-400 mb-3 shrink-0">Alertas da última hora</p>
            <div className="flex flex-wrap gap-1.5 mb-3 shrink-0">
              <button
                type="button"
                onClick={() => setNotificationLineFilter("all")}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                  notificationLineFilter === "all"
                    ? "border-zinc-300 bg-zinc-100 text-zinc-900"
                    : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                Todas
              </button>
              {LINES.map((line) => (
                <button
                  key={line.id}
                  type="button"
                  onClick={() => setNotificationLineFilter(line.id)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    notificationLineFilter === line.id
                      ? "text-white"
                      : "bg-white text-zinc-600 hover:bg-zinc-50 border-zinc-200"
                  }`}
                  style={
                    notificationLineFilter === line.id
                      ? { backgroundColor: line.color, borderColor: line.color }
                      : { borderLeftWidth: "4px", borderLeftColor: line.color }
                  }
                >
                  Linha {line.badge}
                </button>
              ))}
            </div>
            <div className="space-y-2 overflow-y-auto min-h-0 flex-1 pr-1">
              {(() => {
                if (notificationLineFilter === "all") {
                  const seen = new Map<string, { count: number; latestSentAt: Date }>();
                  for (const a of alertsSent) {
                    const key = `${a.lineId ?? "outros"}|${a.optionLabel}`;
                    const prev = seen.get(key);
                    const latest = !prev || a.sentAt > prev.latestSentAt ? a.sentAt : prev.latestSentAt;
                    seen.set(key, { count: (prev?.count ?? 0) + 1, latestSentAt: latest });
                  }
                  const byLineAndType = Array.from(seen.entries())
                    .map(([key, { count, latestSentAt }]) => {
                      const [lineId, optionLabel] = key.split("|");
                      return {
                        lineId: lineId === "outros" ? null : lineId,
                        optionLabel,
                        count,
                        latestSentAt,
                      };
                    })
                    .sort((a, b) => b.count - a.count);
                  if (byLineAndType.length === 0) {
                    return (
                      <p className="text-zinc-500 text-sm py-4 text-center">
                        Nenhum alerta.
                      </p>
                    );
                  }
                  return byLineAndType.map(({ lineId, optionLabel, count, latestSentAt }, i) => {
                    const line = lineId ? LINES.find((l) => l.id === lineId) : null;
                    const cardColor = line?.color ?? "#71717a";
                    return (
                      <div
                        key={`${lineId ?? "x"}-${optionLabel}-${i}`}
                        className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
                        style={{ borderLeftWidth: "4px", borderLeftColor: cardColor }}
                      >
                        <span
                          className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg text-white"
                          style={{ backgroundColor: cardColor }}
                        >
                          {ALERT_TYPE_ICONS[optionLabel]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-zinc-900 text-sm">
                            {ALERT_LABELS[optionLabel] ?? optionLabel}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {line ? `Linha ${line.badge} · ` : ""}{count} {count === 1 ? "relato" : "relatos"}
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Último: {formatTimeAgo(latestSentAt)}
                          </p>
                        </div>
                      </div>
                    );
                  });
                }
                const filtered = alertsSent.filter((a) => a.lineId === notificationLineFilter);
                const byType = countByType(filtered);
                const typesWithCount = (["LOTADO", "TREM PARADO", "ATRASO", "NORMAL"] as const).filter(
                  (key) => (byType[key] ?? 0) > 0
                );
                if (typesWithCount.length === 0) {
                  return (
                    <p className="text-zinc-500 text-sm py-4 text-center">
                      Nenhum alerta nesta linha.
                    </p>
                  );
                }
                const line = LINES.find((l) => l.id === notificationLineFilter);
                const cardColor = line?.color ?? "#A61361";
                const latestByType = new Map<string, Date>();
                for (const a of filtered) {
                  if (a.optionLabel && (!latestByType.has(a.optionLabel) || a.sentAt > latestByType.get(a.optionLabel)!)) {
                    latestByType.set(a.optionLabel, a.sentAt);
                  }
                }
                return typesWithCount.map((key) => {
                  const count = byType[key] ?? 0;
                  const latest = latestByType.get(key);
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
                      style={{ borderLeftWidth: "4px", borderLeftColor: cardColor }}
                    >
                      <span
                        className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg text-white"
                        style={{ backgroundColor: cardColor }}
                      >
                        {ALERT_TYPE_ICONS[key]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-zinc-900 text-sm">
                          {ALERT_LABELS[key] ?? key}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {count} {count === 1 ? "relato" : "relatos"}
                        </p>
                        {latest && (
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Último: {formatTimeAgo(latest)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </section>
        )}
        <div className="w-full max-w-md flex flex-col gap-5">
          {LINES.map((line) => {
            const gradientEnd = darkenHex(line.color, 0.55);
            return (
              <button
                key={line.id}
                type="button"
                onClick={() => setSelectedLine(line.id)}
                className="group relative w-full rounded-2xl overflow-hidden text-left shadow-[0_8px_30x_-8px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-400"
                style={{ background: `linear-gradient(135deg, ${line.color} 0%, ${gradientEnd} 100%)` }}
              >
                <span className="absolute inset-0 flex items-center justify-end pr-0 pointer-events-none select-none overflow-hidden" aria-hidden>
                  <span className="text-[18rem] font-extrabold leading-none text-white/10 tracking-tighter -mr-4">
                    {line.badge}
                  </span>
                </span>
                <div className="relative z-10 p-5 md:p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white font-bold text-lg shrink-0">
                        {line.badge}
                      </span>
                      <span className="font-bold text-white text-lg md:text-xl tracking-tight">
                        {line.name}
                      </span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7h-6M17 7v6" /></svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-white/90 font-semibold text-sm">
                      {line.stat}
                    </p>
                    <p className="text-white/75 text-sm leading-relaxed">
                      {line.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    );
  }

  if (status === "loading") {
    return <LoadingScreen />;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setSelectedLine(null)}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 rounded-xl border border-zinc-300 bg-white/90 backdrop-blur-xl px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] hover:bg-zinc-50"
        aria-label="Voltar para seleção de linha"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Voltar</span>
      </button>
      <button
        type="button"
        onClick={() => setShowAlertCounts(true)}
        className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-zinc-300 bg-white/95 backdrop-blur-xl px-3 py-1.5 text-[0.7rem] sm:text-xs font-medium text-zinc-700 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] hover:bg-zinc-50 max-w-[90vw]"
      >
        {(() => {
          const alertsForCurrentLine = selectedLine
            ? alertsSent.filter((a) => a.lineId === selectedLine)
            : alertsSent;
          if (alertsForCurrentLine.length === 0) {
            return (
              <span className="block text-center">
                Nenhum alerta registrado ainda
              </span>
            );
          }
          const latest = alertsForCurrentLine.reduce(
            (max, a) => (a.sentAt > max ? a.sentAt : max),
            alertsForCurrentLine[0].sentAt
          );
          return (
            <span className="block text-center">
              Últimos alertas · {formatTimeAgo(latest)}
            </span>
          );
        })()}
      </button>
      <button
        type="button"
        onClick={() => setShowAlertCounts(true)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-zinc-300 bg-white/90 backdrop-blur-xl px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] hover:bg-zinc-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 shrink-0 ${bellHighlight ? "animate-bounce" : ""}`}
          style={{ color: lineConfig?.color ?? "#A61361" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span
          className="font-bold"
          style={{ color: lineConfig?.color ?? "#A61361" }}
        >
          {alertsSent.length}
        </span>
        <span className="hidden sm:inline">
          {alertsSent.length === 1 ? "vez alertada" : "vezes alertada"}
        </span>
      </button>

      {showAlertCounts && (() => {
        const alertsForCurrentLine = selectedLine ? alertsSent.filter((a) => a.lineId === selectedLine) : alertsSent;
        return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md max-h-[90vh] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 shrink-0">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl text-white font-bold text-sm" style={{ backgroundColor: lineConfig?.color ?? "#A61361" }}>
                  {alertsForCurrentLine.length}
                </span>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 leading-tight">Status dos alertas</h2>
                  <p className="text-xs text-zinc-500">Alertas da última hora</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowAlertCounts(false)} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100" aria-label="Fechar">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {alertsForCurrentLine.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-zinc-500 text-sm">Nenhum alerta enviado nesta linha nesta sessão.</p>
                  <p className="text-zinc-400 text-xs mt-1">Os alertas enviados nesta linha aparecerão aqui para você acompanhar o status.</p>
                </div>
              ) : (
                <>
                  <section>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Situação por tipo</h3>
                    <div className="space-y-3">
                      {(["LOTADO", "TREM PARADO", "ATRASO", "NORMAL"] as const).map((key) => {
                        const count = countByType(alertsForCurrentLine)[key] ?? 0;
                        const typeAlerts = alertsForCurrentLine.filter((a) => a.optionLabel === key);
                        const latestSentAt = typeAlerts.length > 0 ? typeAlerts.reduce((max, a) => (a.sentAt > max ? a.sentAt : max), typeAlerts[0].sentAt) : null;
                        const msg = ALERT_STATUS_MESSAGE[key];
                        const hasReports = count > 0;
                        const lineColor = lineConfig?.color ?? "#A61361";
                        return (
                          <div
                            key={key}
                            className={`rounded-xl border px-4 py-4 ${hasReports ? "border-amber-200 bg-amber-50/80" : "border-zinc-200 bg-zinc-50/50"}`}
                          >
                            <div className="flex gap-4">
                              <span
                                className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl"
                                style={{ backgroundColor: hasReports ? `${lineColor}20` : undefined }}
                              >
                                <span style={{ color: hasReports ? lineColor : undefined }} className="text-zinc-400">
                                  {ALERT_TYPE_ICONS[key]}
                                </span>
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-zinc-900 text-base mb-0.5">{ALERT_LABELS[key] ?? key}</p>
                                <p className={`text-sm leading-snug ${hasReports ? "text-zinc-700 font-medium" : "text-zinc-500"}`}>
                                  {msg ? (hasReports ? msg.withReports : msg.noReports) : (hasReports ? `${count} relato(s).` : "Nenhum relato.")}
                                </p>
                                <p className="mt-2 text-lg font-bold tabular-nums" style={{ color: hasReports ? lineColor : undefined }}>
                                  {count} {count === 1 ? "relato" : "relatos"}
                                </p>
                                {hasReports && latestSentAt && (
                                  <p className="text-xs text-zinc-500 mt-1">Último: {formatTimeAgo(latestSentAt)}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                  {selectedLine && lineConfig && (
                  <section>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Por linha</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-xl border px-4 py-3" style={{ borderColor: `${lineConfig.color}40`, backgroundColor: `${lineConfig.color}08` }}>
                        <span className="font-medium text-zinc-800 text-sm">{lineConfig.label}</span>
                        <span className="font-bold tabular-nums text-sm" style={{ color: lineConfig.color }}>{alertsForCurrentLine.length} {alertsForCurrentLine.length === 1 ? "alerta" : "alertas"}</span>
                      </div>
                    </div>
                  </section>
                  )}
                  <section>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Notificações</h3>
                    <div className="space-y-3">
                      {groupAlertsByTypeAndLine(alertsForCurrentLine).map((group, i) => {
                        const line = group.lineId ? LINES.find((l) => l.id === group.lineId) : null;
                        const cardColor = line?.color ?? lineConfig?.color ?? "#A61361";
                        const lineLabel = line ? `Linha ${line.badge}` : "Linha";
                        const stationList = Object.entries(group.stations)
                          .map(([name, cnt]) => (cnt > 1 ? `${name} (${cnt})` : name))
                          .join(", ");
                        return (
                          <div
                            key={i}
                            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                            style={{ borderLeftWidth: "4px", borderLeftColor: cardColor }}
                          >
                            <div className="flex gap-3">
                              <span
                                className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-white"
                                style={{ backgroundColor: cardColor }}
                              >
                                {ALERT_TYPE_ICONS[group.optionLabel]}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{lineLabel}</span>
                                  <span className="text-xs text-zinc-400">·</span>
                                  <span className="text-xs text-zinc-500">
                                    {group.count} {group.count === 1 ? "relato" : "relatos"}
                                  </span>
                                  <span className="text-xs text-zinc-400">· Último: {formatTimeAgo(group.latestSentAt)}</span>
                                </div>
                                <p className="font-semibold text-zinc-900 text-sm mb-0.5">
                                  {ALERT_LABELS[group.optionLabel] ?? group.optionLabel}
                                </p>
                                <p className="text-sm text-zinc-600">
                                  Estações: {stationList || "Não informada"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </>
              )}
            </div>
            <div className="p-4 border-t border-zinc-200 shrink-0">
              <button type="button" onClick={() => setShowAlertCounts(false)} className="w-full rounded-xl text-white py-3 font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: lineConfig?.color ?? "#A61361" }}>Fechar</button>
            </div>
          </div>
        </div>
        );
      })()}

      <main className="min-h-screen flex flex-col items-center px-4 pt-8 pb-28 md:pt-12 md:pb-32 overflow-x-hidden">
        <div className="w-full max-w-3xl flex flex-col items-center min-w-0 pt-12">
          <div className="w-full rounded-3xl border border-white/70 bg-white/55 backdrop-blur-xl shadow-[0_18px_60px_-30px_rgba(0,0,0,0.2)] ring-1 ring-zinc-900/5 p-5 md:p-7">
            <h2 className="flex items-center gap-2 text-2xl md:text-4xl font-bold text-left mb-2 tracking-tight" style={{ color: lineConfig?.color ?? "#A61361" }}>
              <span className="inline-flex items-center justify-center w-[1em] h-[1em] rounded-[0.2em] text-white font-bold shrink-0 text-[0.7em] leading-none" style={{ backgroundColor: lineConfig?.color ?? "#A61361" }}>{lineConfig?.badge ?? "7"}</span>
              {lineConfig?.label ?? "Linha 7 Rubi"}
            </h2>

            {(status === "error" || status === "denied") && (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <p className="text-sm max-w-xs font-medium" style={{ color: lineConfig?.color ?? "#A61361" }}>{errorMessage}</p>
                <p className="text-zinc-600 text-xs">Você ainda pode ver o esquema da linha abaixo.</p>
              </div>
            )}

            {effectiveStation && (
              <div className="flex flex-col items-center mb-6">
                <p className="text-zinc-600 text-sm mb-1">
                  {manualStation ? "Estação selecionada:" : "Estação que você está mais próximo:"}
                </p>
                <p className="text-xl md:text-2xl font-semibold" style={{ color: lineConfig?.color ?? "#A61361" }}>{effectiveStation.name}</p>
                {manualStation && (
                  <p className="text-xs text-amber-600 mt-1">Selecione a estação em que você está para alertas precisos.</p>
                )}
              </div>
            )}

            <div className="rounded-2xl border border-white/70 bg-white/40 backdrop-blur-xl p-3 md:p-4 overflow-x-hidden">
              <LineDiagram
                stations={stations}
                currentStationId={effectiveStation?.id ?? null}
                lineColor={lineConfig?.color ?? "#A61361"}
                alertCountsByStation={getAlertCountsByStation(alertsSent, selectedLine)}
                alertLabels={ALERT_LABELS}
                alertTypeIcons={ALERT_TYPE_ICONS}
              />
            </div>
          </div>
        </div>
      </main>
      <FloatingAlertMenu
        currentStationName={effectiveStation?.name}
        lineColor={lineConfig?.color ?? "#A61361"}
        stations={stations}
        onSelectStation={(station) => setManualStation(station)}
        isStationFromLocation={!manualStation && !!currentStation}
        onAlertSent={async (optionLabel, stationName) => {
          if (!isWithinAlertWindow()) {
            setToast({
              type: "error",
              message:
                "Os alertas só podem ser enviados entre 04:40 e 00:00, quando a estação está aberta.",
            });
            return;
          }
          const payload = { lineId: selectedLine ?? null, stationName, alertType: optionLabel };
          if (typeof window !== "undefined" && !window.navigator.onLine) {
            setPendingAlerts((prev) => [
              ...prev,
              {
                optionLabel,
                stationName: stationName ?? null,
                lineId: selectedLine ?? null,
              },
            ]);
            setAlertsSent((prev) => [
              ...prev,
              {
                optionLabel,
                stationName,
                sentAt: new Date(),
                lineId: selectedLine ?? null,
              },
            ]);
            setToast({
              type: "info",
              message:
                "Você está sem internet. Assim que a conexão voltar, seu alerta será enviado.",
            });
            return;
          }
          try {
            const res = await fetch("/api/alerts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.status === 429) {
              setToast({
                type: "error",
                message: data.error ?? "Aguarde 10 minutos para enviar outro alerta.",
              });
              return;
            }
            if (res.ok && data.sentAt) {
              setAlertsSent((prev) => [
                ...prev,
                { optionLabel, stationName, sentAt: new Date(data.sentAt), lineId: selectedLine ?? null },
              ]);
            } else {
              setAlertsSent((prev) => [...prev, { optionLabel, stationName, sentAt: new Date(), lineId: selectedLine ?? null }]);
            }
          } catch {
            if (typeof window !== "undefined" && !window.navigator.onLine) {
              setPendingAlerts((prev) => [
                ...prev,
                {
                  optionLabel,
                  stationName: stationName ?? null,
                  lineId: selectedLine ?? null,
                },
              ]);
              setToast({
                type: "info",
                message:
                  "Você está sem internet. Assim que a conexão voltar, seu alerta será enviado.",
              });
            } else {
              setToast({
                type: "error",
                message:
                  "Não foi possível enviar o alerta agora. Tente novamente em instantes.",
              });
            }
            setAlertsSent((prev) => [
              ...prev,
              { optionLabel, stationName, sentAt: new Date(), lineId: selectedLine ?? null },
            ]);
          }
        }}
      />
      {toast && (
        <div className="fixed top-4 inset-x-0 z-[80] px-3">
          <div
            className={`mx-auto max-w-md flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl text-sm ${
              toast.type === "error"
                ? "bg-red-600 text-white border-red-700"
                : "bg-zinc-900 text-white border-zinc-700"
            }`}
          >
            <span className="hidden xs:flex h-7 w-7 items-center justify-center rounded-full bg-black/10 border border-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v5" />
                <path d="M12 16h.01" />
              </svg>
            </span>
            <span className="flex-1 text-xs sm:text-sm leading-snug">
              {toast.message}
            </span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="rounded-full p-1 hover:bg-black/20 transition-colors"
              aria-label="Fechar aviso"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
