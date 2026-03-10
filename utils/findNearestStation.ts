import { haversineDistance } from "./calculateDistance";
import type { Station } from "@/lib/stations";
import { LINE_7_STATIONS } from "@/lib/stations";

/**
 * Encontra a estação mais próxima do usuário com base em latitude e longitude.
 *
 * @param latitude - Latitude do usuário
 * @param longitude - Longitude do usuário
 * @param stations - Lista de estações (default: LINE_7_STATIONS)
 * @returns A estação mais próxima
 */
export function findNearestStation(
  latitude: number,
  longitude: number,
  stations: Station[] = LINE_7_STATIONS
): Station {
  let nearest = stations[0];
  let minDistance = haversineDistance(
    latitude,
    longitude,
    nearest.latitude,
    nearest.longitude
  );

  for (let i = 1; i < stations.length; i++) {
    const station = stations[i];
    const distance = haversineDistance(
      latitude,
      longitude,
      station.latitude,
      station.longitude
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = station;
    }
  }

  return nearest;
}
