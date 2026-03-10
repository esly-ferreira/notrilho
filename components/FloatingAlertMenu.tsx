"use client";

import { useState } from "react";
import type { Station } from "@/lib/stations";

const ALERT_OPTIONS = [
  { id: "lotado", label: "LOTADO", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
  { id: "trem-parado", label: "TREM PARADO", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg> },
  { id: "atraso", label: "ATRASO", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg> },
  { id: "normal", label: "NORMAL", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m22 4-10 10-4-4" /></svg> },
] as const;

const DISCLAIMER =
  "o usuário tem responsabilidade pelas respostas. caso sejam enviadas de forma errônea, a plataforma não se responsabiliza. pedimos que sejam sinceros para não gerar alarme falso e prejudicar o sistema por inteiro.";

type SentAlert = { option: (typeof ALERT_OPTIONS)[number]; stationName: string | null };

interface FloatingAlertMenuProps {
  currentStationName?: string | null;
  onAlertSent?: (optionLabel: string, stationName: string | null) => void;
  lineColor?: string;
  stations?: Station[];
  onSelectStation?: (station: Station) => void;
  /** true quando a estação veio da localização automática (usuário não escolheu manualmente) */
  isStationFromLocation?: boolean;
}

export function FloatingAlertMenu({ currentStationName = null, onAlertSent, lineColor = "#A61361", stations = [], onSelectStation, isStationFromLocation = false }: FloatingAlertMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAlert, setPendingAlert] = useState<(typeof ALERT_OPTIONS)[number] | null>(null);
  const [sentAlert, setSentAlert] = useState<SentAlert | null>(null);
  const [showLocationRequired, setShowLocationRequired] = useState(false);
  const [showStationPicker, setShowStationPicker] = useState(false);
  const [showChangeStationConfirm, setShowChangeStationConfirm] = useState(false);

  const hasLocation = currentStationName != null && currentStationName !== "";

  const handleSelectStationClick = () => {
    if (isStationFromLocation) {
      setShowChangeStationConfirm(true);
    } else {
      setShowStationPicker(true);
    }
  };

  const handleConfirmChangeStation = () => {
    setShowChangeStationConfirm(false);
    setShowStationPicker(true);
  };

  const handleMainButtonClick = () => {
    if (!hasLocation) {
      setShowLocationRequired(true);
      return;
    }
    setIsOpen((prev) => !prev);
  };

  const handleConfirm = () => {
    if (!pendingAlert) return;
    const stationName = currentStationName ?? null;
    setSentAlert({ option: pendingAlert, stationName });
    onAlertSent?.(pendingAlert.label, stationName);
    setPendingAlert(null);
    setIsOpen(false);
  };

  return (
    <>
      {sentAlert && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur-xl shadow-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2" style={{ color: lineColor }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m22 4-10 10-4-4" /></svg>
              <h3 className="text-lg font-bold text-zinc-900">Enviado para a base</h3>
            </div>
            <p className="text-zinc-700">
              Seu alerta <strong style={{ color: lineColor }}>{sentAlert.option.label}</strong>
              {sentAlert.stationName ? <> referente à estação <strong>{sentAlert.stationName}</strong></> : null}
              {" "}foi registrado com sucesso.
            </p>
            <p className="text-zinc-600 text-sm">Obrigado por contribuir com a plataforma Notrilho.</p>
            <button type="button" onClick={() => setSentAlert(null)} className="rounded-xl text-white py-3 font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: lineColor }}>Ok</button>
          </div>
        </div>
      )}
      {showLocationRequired && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur-xl shadow-xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-zinc-900">Localização necessária</h3>
            <p className="text-zinc-700">
              A localização precisa estar ativada para gerar o alerta. Ative a localização do dispositivo e atualize a página para que sua estação seja identificada.
            </p>
            <p className="text-xs text-zinc-500 lowercase leading-relaxed">
              ative nas configurações do navegador ou do dispositivo e recarregue a página.
            </p>
            <button type="button" onClick={() => setShowLocationRequired(false)} className="w-full rounded-xl text-white py-3 font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: lineColor }}>Confirmar</button>
          </div>
        </div>
      )}
      {showChangeStationConfirm && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur-xl shadow-xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-zinc-900">Trocar estação</h3>
            <p className="text-zinc-700 text-sm">
              Este menu é para trocar a estação. Você já tem uma estação selecionada automaticamente pela sua localização.
            </p>
            <p className="text-zinc-600 text-sm">Deseja mudar para outra estação?</p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowChangeStationConfirm(false)} className="flex-1 rounded-xl border border-zinc-300 bg-white py-3 font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">Cancelar</button>
              <button type="button" onClick={handleConfirmChangeStation} className="flex-1 rounded-xl text-white py-3 font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: lineColor }}>Sim, trocar</button>
            </div>
          </div>
        </div>
      )}
      {showStationPicker && stations.length > 0 && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur-xl shadow-xl">
            <div className="p-4 border-b border-zinc-200 shrink-0">
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Selecionar estação</h3>
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                Selecione a estação em que você está no momento. Escolha a correta para que os alertas sejam enviados com precisão.
              </p>
            </div>
            <div className="overflow-y-auto p-3 flex-1 min-h-0">
              <ul className="space-y-1.5">
                {stations.map((station) => (
                  <li key={station.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectStation?.(station);
                        setShowStationPicker(false);
                      }}
                      className="w-full text-left rounded-xl border border-zinc-200 bg-white py-3 px-4 font-medium text-zinc-800 hover:bg-zinc-50 transition-colors"
                      style={{ borderLeftWidth: "4px", borderLeftColor: lineColor }}
                    >
                      {station.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 border-t border-zinc-200 shrink-0">
              <button type="button" onClick={() => setShowStationPicker(false)} className="w-full rounded-xl border border-zinc-300 bg-white py-3 font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {pendingAlert && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur-xl shadow-xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-zinc-900">Confirmar envio do alerta</h3>
            <p className="text-zinc-700">
              Deseja realmente enviar o alerta <strong style={{ color: lineColor }}>{pendingAlert.label}</strong>?
            </p>
            <p className="text-xs text-zinc-500 lowercase leading-relaxed">{DISCLAIMER}</p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setPendingAlert(null)} className="flex-1 rounded-xl border border-zinc-300 bg-white py-3 font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">Cancelar</button>
              <button type="button" onClick={handleConfirm} className="flex-1 rounded-xl text-white py-3 font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: lineColor }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 md:pb-8 pointer-events-none">
        <div className="max-w-lg mx-auto flex flex-col items-center gap-2 pointer-events-auto">
          {isOpen && (
            <div className="w-full flex flex-wrap justify-center gap-2">
              {ALERT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPendingAlert(option)}
                  className="flex items-center gap-2 rounded-xl border border-white/80 bg-white/50 backdrop-blur-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.5)_inset] py-3 px-4 text-sm font-semibold text-zinc-800 hover:bg-white/70 hover:border-white transition-all duration-200"
                >
                  <span style={{ color: lineColor }}>{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-nowrap items-center justify-center gap-2 w-full min-w-0">
            <button
              type="button"
              onClick={handleSelectStationClick}
              className={`flex flex-1 items-center justify-center gap-1.5 min-w-0 rounded-2xl border backdrop-blur-xl font-bold py-4 px-3 sm:px-5 text-sm sm:text-base shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] transition-colors ${
                isStationFromLocation
                  ? "border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed opacity-70"
                  : "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" style={{ color: isStationFromLocation ? undefined : lineColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span className="truncate">Selecionar estação</span>
            </button>
            <button
              type="button"
              onClick={handleMainButtonClick}
              className={`flex flex-1 items-center justify-center gap-1.5 min-w-0 rounded-2xl border backdrop-blur-xl font-bold py-4 px-3 sm:px-8 text-sm sm:text-base shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] transition-colors ${
                hasLocation
                  ? "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50"
                  : "border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed opacity-70"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 shrink-0 ${hasLocation ? "" : "text-zinc-400"}`} style={hasLocation ? { color: lineColor } : undefined} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
              <span className="truncate">{isOpen ? "Fechar" : "Gerar alerta"}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
