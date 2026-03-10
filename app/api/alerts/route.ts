import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export type AlertRow = {
  id: string;
  line_id: string | null;
  station_name: string | null;
  alert_type: string;
  created_at: string;
};

export type AlertResponse = {
  optionLabel: string;
  stationName: string | null;
  sentAt: string;
  lineId: string | null;
};

function toResponse(row: AlertRow): AlertResponse {
  return {
    optionLabel: row.alert_type,
    stationName: row.station_name,
    sentAt: row.created_at,
    lineId: row.line_id,
  };
}

const ONE_HOUR_MS = 60 * 60 * 1000;
const TEN_MINUTES_MS = 10 * 60 * 1000;

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return null;
}

/**
 * GET /api/alerts
 * Lista alertas da última 1 hora. Query: ?lineId=line-7 para filtrar por linha.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lineId = searchParams.get("lineId");

    const oneHourAgo = new Date(Date.now() - ONE_HOUR_MS).toISOString();

    let query = supabase
      .from("alerts")
      .select("id, line_id, station_name, alert_type, created_at")
      .gte("created_at", oneHourAgo)
      .order("created_at", { ascending: false });

    if (lineId) {
      query = query.eq("line_id", lineId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase GET alerts error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const list = (data as AlertRow[] ?? []).map(toResponse);
    return NextResponse.json(list);
  } catch (err) {
    console.error("GET /api/alerts error:", err);
    return NextResponse.json(
      { error: "Erro ao buscar alertas" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/alerts
 * Body: { lineId?: string | null, stationName?: string | null, alertType: string }
 * Limite: 1 alerta por IP a cada 10 minutos.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const body = await request.json();
    const lineId = body.lineId ?? null;
    const stationName = body.stationName ?? null;
    const alertType = body.alertType;

    if (!alertType || typeof alertType !== "string") {
      return NextResponse.json(
        { error: "alertType é obrigatório" },
        { status: 400 }
      );
    }

    if (ip) {
      const tenMinAgo = new Date(Date.now() - TEN_MINUTES_MS).toISOString();
      const { data: recent } = await supabase
        .from("alerts")
        .select("id")
        .eq("ip_address", ip)
        .gte("created_at", tenMinAgo)
        .limit(1);

      if (recent && recent.length > 0) {
        return NextResponse.json(
          { error: "Aguarde 10 minutos para enviar outro alerta." },
          { status: 429 }
        );
      }
    }

    const { data, error } = await supabase
      .from("alerts")
      .insert({
        line_id: lineId,
        station_name: stationName,
        alert_type: alertType,
        ip_address: ip,
      })
      .select("id, line_id, station_name, alert_type, created_at")
      .single();

    if (error) {
      console.error("Supabase POST alerts error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(toResponse(data as AlertRow));
  } catch (err) {
    console.error("POST /api/alerts error:", err);
    return NextResponse.json(
      { error: "Erro ao salvar alerta" },
      { status: 500 }
    );
  }
}
