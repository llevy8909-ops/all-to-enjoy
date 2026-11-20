import { CareFacility } from '../types/medical';

// Calculate distance in kilometers between two lat/lng coordinates (Haversine formula)
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

// Preset metropolitan hubs for quick city switching
export const PRESET_CITIES = [
  { name: 'Riyadh, Saudi Arabia', lat: 24.7136, lng: 46.6753 },
  { name: 'London, United Kingdom', lat: 51.5074, lng: -0.1278 },
  { name: 'New York, USA', lat: 40.7128, lng: -74.006 },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  { name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832 },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
];

// Map Google Places API (New) raw Place object into our CareFacility UI model
export function mapGooglePlaceToFacility(
  place: any,
  originLat: number,
  originLng: number,
  userGpsCoords?: { lat: number; lng: number } | null
): CareFacility | null {
  if (!place?.location?.latitude || !place?.location?.longitude) {
    return null;
  }

  const lat = Number(place.location.latitude);
  const lng = Number(place.location.longitude);
  const distanceKm = calculateDistanceKm(originLat, originLng, lat, lng);

  const types: string[] = Array.isArray(place.types) ? place.types : [];
  const primaryType: string = place.primaryType || '';
  const displayNameText: string = place.displayName?.text || 'Healthcare Facility';
  const nameLower = displayNameText.toLowerCase();
  const primaryDisplayLower = (place.primaryTypeDisplayName?.text || '').toLowerCase();
  const combinedLabel = `${nameLower} ${primaryDisplayLower}`;

  const isPharmacy =
    primaryType === 'pharmacy' ||
    primaryType === 'drugstore' ||
    types.includes('pharmacy') ||
    types.includes('drugstore');

  const isHospital =
    primaryType === 'hospital' ||
    primaryType === 'general_hospital' ||
    types.includes('hospital') ||
    types.includes('general_hospital');

  const matchesUrgentCareKeywords =
    combinedLabel.includes('urgent') ||
    combinedLabel.includes('walk-in') ||
    combinedLabel.includes('walk in') ||
    combinedLabel.includes('immediate care') ||
    combinedLabel.includes('express care') ||
    combinedLabel.includes('acute care') ||
    combinedLabel.includes('after hours') ||
    combinedLabel.includes('emergency clinic') ||
    combinedLabel.includes('emergency care') ||
    combinedLabel.includes('emergency center') ||
    combinedLabel.includes('medexpress') ||
    combinedLabel.includes('citymd') ||
    combinedLabel.includes('carenow') ||
    combinedLabel.includes('fastmed') ||
    combinedLabel.includes('gohealth');

  let facilityType: CareFacility['type'] = 'clinic';
  if (isPharmacy) {
    facilityType = 'pharmacy';
  } else if (matchesUrgentCareKeywords) {
    facilityType = 'urgent_care';
  } else if (isHospital) {
    facilityType = 'hospital';
  } else if (place._fromUrgentCareSearch) {
    facilityType = 'urgent_care';
  }

  const openingHours = place.currentOpeningHours || place.regularOpeningHours;
  const weekdayDescriptions: string[] = Array.isArray(openingHours?.weekdayDescriptions)
    ? openingHours.weekdayDescriptions
    : [];

  // Determine today's hours string from weekdayDescriptions (0 = Sunday in JS Date, Google weekdayDescriptions starts Monday = index 0)
  const jsDay = new Date().getDay(); // 0=Sun..6=Sat
  const googleDayIdx = jsDay === 0 ? 6 : jsDay - 1;
  const todayHours = weekdayDescriptions[googleDayIdx] || undefined;

  const is24Hours =
    todayHours?.toLowerCase().includes('open 24 hours') ||
    weekdayDescriptions.some((d) => d.toLowerCase().includes('open 24 hours'));

  const isOpenNow: boolean | null =
    typeof openingHours?.openNow === 'boolean' ? openingHours.openNow : null;

  let statusText = 'Hours unavailable';
  let statusBadgeColor: CareFacility['statusBadgeColor'] = 'slate';

  if (place.businessStatus === 'CLOSED_TEMPORARILY') {
    statusText = 'Temporarily Closed';
    statusBadgeColor = 'rose';
  } else if (place.businessStatus === 'CLOSED_PERMANENTLY') {
    statusText = 'Permanently Closed';
    statusBadgeColor = 'rose';
  } else if (is24Hours && isOpenNow !== false) {
    statusText = 'Open 24 Hours';
    statusBadgeColor = 'blue';
  } else if (isOpenNow === true) {
    statusText = todayHours ? `Open Now · ${todayHours.split(': ').slice(1).join(': ')}` : 'Open Now';
    statusBadgeColor = 'emerald';
  } else if (isOpenNow === false) {
    statusText = todayHours ? `Closed · ${todayHours.split(': ').slice(1).join(': ')}` : 'Closed Now';
    statusBadgeColor = 'rose';
  } else if (todayHours) {
    statusText = todayHours;
    statusBadgeColor = 'slate';
  }

  return {
    id: place.id || `place-${lat.toFixed(5)}-${lng.toFixed(5)}-${displayNameText.slice(0, 16)}`,
    name: displayNameText,
    type: facilityType,
    primaryTypeLabel: place.primaryTypeDisplayName?.text || facilityType.replace('_', ' '),
    lat,
    lng,
    address: place.shortFormattedAddress || place.formattedAddress || 'Address on Google Maps',
    phone: place.nationalPhoneNumber || place.internationalPhoneNumber || undefined,
    rating: typeof place.rating === 'number' ? place.rating : undefined,
    reviewsCount: typeof place.userRatingCount === 'number' ? place.userRatingCount : undefined,
    emergency247: Boolean(is24Hours && (facilityType === 'hospital' || facilityType === 'urgent_care' || facilityType === 'pharmacy')),
    weekdayDescriptions,
    todayHours,
    businessStatus: place.businessStatus,
    googleMapsUri: place.googleMapsUri,
    directionsUri: userGpsCoords
      ? `https://www.google.com/maps/dir/?api=1&origin=${userGpsCoords.lat},${userGpsCoords.lng}&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(place.id)}`
      : place.googleMapsLinks?.directionsUri ||
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(place.id)}`,
    distanceKm,
    isOpenNow,
    statusText,
    statusBadgeColor,
  };
}
