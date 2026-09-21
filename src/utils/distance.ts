/**
 * Distance calculation utilities using the Haversine formula
 * Calculates great-circle distance between two pairs of latitude and longitude coordinates.
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Converts degrees to radians
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates the distance in kilometers between two geographic coordinates using the Haversine formula.
 *
 * @param lat1 Latitude of first point in decimal degrees
 * @param lon1 Longitude of first point in decimal degrees
 * @param lat2 Latitude of second point in decimal degrees
 * @param lon2 Longitude of second point in decimal degrees
 * @returns Distance in kilometers
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (
    typeof lat1 !== 'number' ||
    typeof lon1 !== 'number' ||
    typeof lat2 !== 'number' ||
    typeof lon2 !== 'number' ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return Infinity;
  }

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const rLat1 = toRadians(lat1);
  const rLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Formats a distance in kilometers to 1 decimal place.
 * Example: 4.234 -> "4.2 km"
 */
export function formatDistanceKm(distanceKm: number): string {
  if (!isFinite(distanceKm) || isNaN(distanceKm)) {
    return 'Unknown distance';
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Checks whether a given distance is within the allowed delivery radius.
 */
export function isWithinDeliveryRadius(distanceKm: number, radiusKm: number): boolean {
  return isFinite(distanceKm) && distanceKm <= radiusKm;
}

/**
 * Generates a standard Google Maps location URL for given coordinates.
 */
export function getGoogleMapsLocationUrl(lat: number, lon: number): string {
  return `https://www.google.com/maps?q=${lat},${lon}`;
}
