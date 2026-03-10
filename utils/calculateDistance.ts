/**
 * Raio da Terra em quilômetros (valor médio).
 */
const EARTH_RADIUS_KM = 6371;

/**
 * Calcula a distância em quilômetros entre dois pontos na superfície da Terra
 * usando a fórmula de Haversine.
 *
 * @param lat1 - Latitude do primeiro ponto (graus)
 * @param lon1 - Longitude do primeiro ponto (graus)
 * @param lat2 - Latitude do segundo ponto (graus)
 * @param lon2 - Longitude do segundo ponto (graus)
 * @returns Distância em quilômetros
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}
