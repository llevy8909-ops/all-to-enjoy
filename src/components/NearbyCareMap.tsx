import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  APILoadingStatus,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Phone,
  Navigation,
  Clock,
  Search,
  Hospital,
  Stethoscope,
  Pill,
  ShieldAlert,
  Compass,
  LocateFixed,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { CareFacility } from '../types/medical';
import {
  PRESET_CITIES,
  calculateDistanceKm,
  mapGooglePlaceToFacility,
} from '../data/facilities';

interface NearbyCareMapProps {
  initialFacilityType?: 'all' | 'pharmacy' | 'clinic' | 'urgent_care' | 'hospital';
  isDarkMode: boolean;
}

const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 };

export const NearbyCareMap: React.FC<NearbyCareMapProps> = ({
  initialFacilityType = 'all',
  isDarkMode,
}) => {
  const [apiKey, setApiKey] = useState<string>(
    () => (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || ''
  );
  const [configLoaded, setConfigLoaded] = useState<boolean>(
    () => Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
  );
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    if (apiKey) {
      setConfigLoaded(true);
      return;
    }

    let cancelled = false;
    fetch('/api/maps/config')
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        if (cancelled) return;
        if (data?.apiKey) {
          setApiKey(data.apiKey);
        } else {
          setConfigError(
            'Google Maps API key is not configured yet. Please complete Google Maps setup or restart the server.'
          );
        }
        setConfigLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setConfigError('Failed to load Google Maps configuration from server.');
        setConfigLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  if (!configLoaded) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center gap-3 min-h-[480px]">
        <RefreshCw className="w-7 h-7 text-emerald-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Initializing Google Maps Platform...
        </p>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center min-h-[420px] flex flex-col items-center justify-center gap-3">
        <AlertCircle className="w-10 h-10 text-amber-500" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Google Maps API Key Required
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
          {configError ||
            'Please configure your Google Maps Platform API key in Settings > Secrets or restart the server to load the provisioned key.'}
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['places', 'marker']} language="en">
      <NearbyCareMapContent
        initialFacilityType={initialFacilityType}
        isDarkMode={isDarkMode}
      />
    </APIProvider>
  );
};

interface AdvancedMarkerWithRefProps {
  facility: CareFacility;
  isSelected: boolean;
  zIndex: number;
  onMarkerClick: (
    facility: CareFacility,
    marker: google.maps.marker.AdvancedMarkerElement
  ) => void;
}

const FacilityAdvancedMarker: React.FC<AdvancedMarkerWithRefProps> = ({
  facility,
  isSelected,
  zIndex,
  onMarkerClick,
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const colorClasses =
    facility.type === 'hospital'
      ? 'bg-rose-600 border-rose-200'
      : facility.type === 'urgent_care'
      ? 'bg-amber-500 border-white ring-2 ring-amber-400/70'
      : facility.type === 'clinic'
      ? 'bg-blue-600 border-blue-200'
      : 'bg-emerald-600 border-emerald-200';

  const isUrgent = facility.type === 'urgent_care';
  const effectiveZ = isSelected ? 1000 : isUrgent ? 450 + zIndex : zIndex;

  return (
    <AdvancedMarker
      ref={markerRef}
      position={{ lat: facility.lat, lng: facility.lng }}
      zIndex={effectiveZ}
      title={facility.name}
      onClick={() => {
        if (marker) {
          onMarkerClick(facility, marker);
        }
      }}
    >
      <div
        className={`relative flex flex-col items-center justify-center transition-transform duration-150 ${
          isSelected ? 'scale-125' : 'hover:scale-110'
        }`}
      >
        <div className="relative flex items-center justify-center">
          {(facility.emergency247 || isUrgent) && (
            <span
              className={`animate-ping absolute inset-0 m-auto w-8 h-8 rounded-full opacity-45 ${
                isUrgent ? 'bg-amber-400' : 'bg-rose-500'
              }`}
            />
          )}
          <div
            className={`${isUrgent ? 'w-9 h-9' : 'w-8 h-8'} rounded-full ${colorClasses} text-white shadow-lg flex items-center justify-center border-2 relative z-10`}
          >
            {facility.type === 'hospital' ? (
              <Hospital className="w-4 h-4" />
            ) : facility.type === 'urgent_care' ? (
              <ShieldAlert className="w-4 h-4" />
            ) : facility.type === 'clinic' ? (
              <Stethoscope className="w-4 h-4" />
            ) : (
              <Pill className="w-4 h-4" />
            )}
          </div>
        </div>
        {isUrgent && (
          <span className="mt-0.5 px-1.5 py-0.5 rounded bg-amber-600 text-white text-[9px] font-extrabold uppercase tracking-wide shadow-md whitespace-nowrap border border-amber-200 relative z-10">
            Urgent Care
          </span>
        )}
      </div>
    </AdvancedMarker>
  );
};

const NearbyCareMapContent: React.FC<NearbyCareMapProps> = ({
  initialFacilityType = 'all',
  isDarkMode,
}) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const apiStatus = useApiLoadingStatus();

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>(
    DEFAULT_CENTER
  );
  const [userGpsCoords, setUserGpsCoords] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
  } | null>(null);
  const userGpsCoordsRef = useRef<{ lat: number; lng: number } | null>(null);
  const [followGpsMode, setFollowGpsMode] = useState<boolean>(true);
  const [gpsStatus, setGpsStatus] = useState<
    'idle' | 'locating' | 'linked' | 'denied' | 'unavailable'
  >('idle');
  const [locationName, setLocationName] = useState<string>('Detecting your location...');
  const [selectedType, setSelectedType] = useState<string>(initialFacilityType);
  const [onlyOpenNow, setOnlyOpenNow] = useState<boolean>(false);
  const [searchRadius, setSearchRadius] = useState<number>(10);
  const [facilities, setFacilities] = useState<CareFacility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<CareFacility | null>(null);
  const [selectedMarker, setSelectedMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [expandedHoursId, setExpandedHoursId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Autocomplete search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const nearbyAbortRef = useRef<AbortController | null>(null);
  const geocodeAbortRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      nearbyAbortRef.current?.abort();
      geocodeAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (
      apiStatus === APILoadingStatus.AUTH_FAILURE ||
      apiStatus === APILoadingStatus.FAILED
    ) {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    }
  }, [apiStatus]);

  useEffect(() => {
    if (initialFacilityType) {
      setSelectedType(initialFacilityType);
    }
  }, [initialFacilityType]);

  // Reverse-geocode GPS coordinates into a human-readable neighborhood/city label
  const resolveGpsLocationLabel = useCallback(async (lat: number, lng: number) => {
    geocodeAbortRef.current?.abort();
    const controller = new AbortController();
    geocodeAbortRef.current = controller;
    try {
      const res = await fetch(
        `/api/maps/geocode?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`,
        { signal: controller.signal }
      );
      const data = await res.json().catch(() => null);
      if (!isMountedRef.current || controller.signal.aborted) return;
      if (res.status === 429 || data?.quotaExceeded) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        return;
      }
      if (res.ok && (data?.shortLabel || data?.formattedAddress)) {
        setLocationName(data.shortLabel || data.formattedAddress);
      } else {
        setLocationName(`GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
      }
    } catch (err: any) {
      if (err?.name === 'AbortError' || !isMountedRef.current) return;
      setLocationName(`GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    }
  }, []);

  // Fetch nearby facilities from Google Places API (New) via server proxy
  const loadNearbyFacilities = useCallback(
    async (lat: number, lng: number, radiusKm: number, typeFilter: string) => {
      nearbyAbortRef.current?.abort();
      const controller = new AbortController();
      nearbyAbortRef.current = controller;

      setIsLoading(true);
      setApiError(null);
      try {
        const res = await fetch('/api/maps/nearby', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            lat,
            lng,
            radius: radiusKm * 1000,
            type: typeFilter,
          }),
        });

        const data = await res.json().catch(() => null);
        if (!isMountedRef.current || controller.signal.aborted) return;

        if (
          res.status === 429 ||
          data?.quotaExceeded ||
          data?.error?.status === 'RESOURCE_EXHAUSTED'
        ) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
          setApiError(
            'Unable to load nearby care data right now due to API quota limits.'
          );
          setFacilities([]);
          return;
        }

        if (!res.ok) {
          setApiError(data?.error || 'Unable to load nearby places.');
          setFacilities([]);
          return;
        }

        const rawPlaces = Array.isArray(data?.places) ? data.places : [];
        const seenIds = new Set<string>();
        const mapped = rawPlaces
          .map((p: any) =>
            mapGooglePlaceToFacility(p, lat, lng, userGpsCoordsRef.current)
          )
          .filter((f: CareFacility | null): f is CareFacility => {
            if (!f || seenIds.has(f.id)) return false;
            seenIds.add(f.id);
            return true;
          })
          .sort(
            (a: CareFacility, b: CareFacility) =>
              (a.distanceKm || 0) - (b.distanceKm || 0)
          );

        setFacilities(mapped);
      } catch (err: any) {
        if (err?.name === 'AbortError' || !isMountedRef.current) return;
        setApiError('Network error while loading nearby medical facilities.');
      } finally {
        if (isMountedRef.current && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  // Request & link live GPS position on mount
  const requestAndLinkPosition = useCallback(
    (isUserTriggered = false) => {
      if (!navigator.geolocation) {
        setGpsStatus('unavailable');
        setLocationName('Riyadh, Saudi Arabia');
        if (isUserTriggered) {
          setApiError('Geolocation is not supported by your browser.');
        }
        return;
      }

      setIsLocating(true);
      setGpsStatus('locating');
      setApiError(null);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const accuracy = Math.round(pos.coords.accuracy);
          const nextGps = { lat, lng, accuracy };

          userGpsCoordsRef.current = { lat, lng };
          setUserGpsCoords(nextGps);
          setFollowGpsMode(true);
          setGpsStatus('linked');
          setCurrentCoords({ lat, lng });
          setSelectedFacility(null);
          setSelectedMarker(null);
          setIsLocating(false);
          resolveGpsLocationLabel(lat, lng);
        },
        (err) => {
          setIsLocating(false);
          setFollowGpsMode(false);
          if (err.code === err.PERMISSION_DENIED) {
            setGpsStatus('denied');
            if (!userGpsCoordsRef.current) {
              setLocationName('Riyadh, Saudi Arabia (Default)');
            }
            setApiError(
              'Location permission was denied. Allow location access in your browser bar and click "Link My Position", or search your city below.'
            );
          } else {
            setGpsStatus('unavailable');
            if (!userGpsCoordsRef.current) {
              setLocationName('Riyadh, Saudi Arabia (Default)');
            }
            if (isUserTriggered) {
              setApiError(
                'Could not acquire your GPS signal. Showing default area — use search or presets to jump to your city.'
              );
            }
          }
        },
        { timeout: 10000, enableHighAccuracy: true, maximumAge: 30000 }
      );
    },
    [resolveGpsLocationLabel]
  );

  // Auto-link user position when the map loads
  const initialLocateAttemptedRef = useRef(false);
  useEffect(() => {
    if (initialLocateAttemptedRef.current) return;
    initialLocateAttemptedRef.current = true;
    requestAndLinkPosition(false);
  }, [requestAndLinkPosition]);

  // Keep live user GPS marker updated as user moves
  useEffect(() => {
    if (gpsStatus !== 'linked' || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy);

        userGpsCoordsRef.current = { lat, lng };
        setUserGpsCoords({ lat, lng, accuracy });

        if (followGpsMode) {
          setCurrentCoords((prev) => {
            const movedKm = calculateDistanceKm(prev.lat, prev.lng, lat, lng);
            // Refresh search center only if user moved >= 250m to conserve API quota
            if (movedKm >= 0.25) {
              resolveGpsLocationLabel(lat, lng);
              return { lat, lng };
            }
            return prev;
          });
        }
      },
      () => {
        // Ignore transient watchPosition errors if initial lock succeeded
      },
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 15000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [gpsStatus, followGpsMode, resolveGpsLocationLabel]);

  // Load places whenever coordinates, radius, or type filter change
  useEffect(() => {
    loadNearbyFacilities(
      currentCoords.lat,
      currentCoords.lng,
      searchRadius,
      selectedType
    );
  }, [currentCoords, searchRadius, selectedType, loadNearbyFacilities]);

  // Pan Google Map smoothly when currentCoords change
  useEffect(() => {
    if (map) {
      map.panTo(currentCoords);
      map.setZoom(14);
    }
  }, [map, currentCoords]);

  // Modern AutocompleteSuggestion with session tokens
  useEffect(() => {
    if (!placesLib || !searchQuery.trim() || !showSuggestions) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new AutocompleteSessionToken();
        }
        const res = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: searchQuery,
          sessionToken: sessionTokenRef.current,
        });
        setSuggestions(res.suggestions || []);
      } catch (err: any) {
        const msg = String(err?.message || err);
        if (msg.includes('OVER_QUERY_LIMIT') || msg.includes('RESOURCE_EXHAUSTED')) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [placesLib, searchQuery, showSuggestions]);

  const handleSelectSuggestion = async (
    suggestion: google.maps.places.AutocompleteSuggestion
  ) => {
    if (!suggestion.placePrediction) return;
    try {
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: ['location', 'displayName', 'formattedAddress'],
      });

      const loc = place.location;
      if (loc) {
        const lat = loc.lat();
        const lng = loc.lng();
        setFollowGpsMode(false);
        setCurrentCoords({ lat, lng });
        setLocationName(
          place.displayName || place.formattedAddress || searchQuery
        );
        setSelectedFacility(null);
        setSelectedMarker(null);
      }

      setSearchQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
      sessionTokenRef.current = null;
    } catch {
      setApiError('Unable to retrieve location details for selected place.');
    }
  };

  // Fallback form submit via server Geocoding proxy
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);

    if (suggestions[0]?.placePrediction) {
      await handleSelectSuggestion(suggestions[0]);
      return;
    }

    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch(
        `/api/maps/geocode?address=${encodeURIComponent(searchQuery.trim())}`
      );
      const data = await res.json().catch(() => null);
      if (res.status === 429 || data?.quotaExceeded) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        setApiError('Geocoding quota reached.');
        return;
      }
      if (res.ok && typeof data.lat === 'number' && typeof data.lng === 'number') {
        setFollowGpsMode(false);
        setCurrentCoords({ lat: data.lat, lng: data.lng });
        setLocationName(
          data.shortLabel ||
            data.formattedAddress?.split(',').slice(0, 2).join(',') ||
            searchQuery
        );
        setSelectedFacility(null);
        setSelectedMarker(null);
        setSearchQuery('');
      } else {
        setApiError(data?.error || 'Location not found. Try a major city name.');
      }
    } catch {
      setApiError('Location search failed. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocateMe = () => {
    if (userGpsCoords && gpsStatus === 'linked') {
      setFollowGpsMode(true);
      setCurrentCoords({ lat: userGpsCoords.lat, lng: userGpsCoords.lng });
      setSelectedFacility(null);
      setSelectedMarker(null);
      resolveGpsLocationLabel(userGpsCoords.lat, userGpsCoords.lng);
      if (map) {
        map.panTo({ lat: userGpsCoords.lat, lng: userGpsCoords.lng });
        map.setZoom(14);
      }
      return;
    }
    requestAndLinkPosition(true);
  };

  const handleSelectCity = (city: (typeof PRESET_CITIES)[0]) => {
    setFollowGpsMode(false);
    setCurrentCoords({ lat: city.lat, lng: city.lng });
    setLocationName(city.name);
    setSelectedFacility(null);
    setSelectedMarker(null);
  };

  const filteredFacilities = useMemo(() => {
    return facilities.filter((f) => {
      if (selectedType !== 'all' && f.type !== selectedType) {
        // Urgent Care view also surfaces emergency-capable urgent/walk-in facilities returned for the query
        if (!(selectedType === 'urgent_care')) {
          return false;
        }
      }
      if (onlyOpenNow && f.isOpenNow !== true) {
        return false;
      }
      if (f.distanceKm !== undefined && f.distanceKm > searchRadius) {
        return false;
      }
      return true;
    });
  }, [facilities, selectedType, onlyOpenNow, searchRadius]);

  const urgentCareCount = useMemo(
    () => facilities.filter((f) => f.type === 'urgent_care').length,
    [facilities]
  );

  // Auto-frame visible pins inside the map viewport when facilities load or Urgent Care filter is active
  useEffect(() => {
    if (!map || filteredFacilities.length === 0 || typeof google === 'undefined' || !google.maps?.LatLngBounds) {
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(currentCoords);
    filteredFacilities.slice(0, 15).forEach((f) => {
      bounds.extend({ lat: f.lat, lng: f.lng });
    });
    map.fitBounds(bounds, { top: 68, right: 48, bottom: 68, left: 48 });
    const listener = google.maps.event.addListenerOnce(map, 'idle', () => {
      const z = map.getZoom();
      if (typeof z === 'number' && z > 15) {
        map.setZoom(15);
      }
    });
    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, filteredFacilities, currentCoords]);

  const handleMarkerClick = useCallback(
    (
      facility: CareFacility,
      marker: google.maps.marker.AdvancedMarkerElement
    ) => {
      setSelectedFacility(facility);
      setSelectedMarker(marker);
    },
    []
  );

  const handleCardClick = (facility: CareFacility) => {
    setSelectedFacility(facility);
    setSelectedMarker(null);
    if (map) {
      map.panTo({ lat: facility.lat, lng: facility.lng });
      map.setZoom(15);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Controls Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  gpsStatus === 'linked' && followGpsMode
                    ? 'bg-emerald-500 animate-pulse'
                    : gpsStatus === 'locating'
                    ? 'bg-cyan-500 animate-ping'
                    : 'bg-slate-400'
                }`}
              />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Care Near You: Google Maps &amp; Live Hours
              </h2>
              {gpsStatus === 'linked' && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {followGpsMode ? 'Live Position Linked' : 'GPS Ready'}
                  {userGpsCoords?.accuracy ? ` · ±${userGpsCoords.accuracy}m` : ''}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {followGpsMode && gpsStatus === 'linked'
                ? 'Your Live Position:'
                : 'Active Search Area:'}{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {locationName}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleLocateMe}
              disabled={isLocating}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl active:scale-95 text-white font-medium text-sm transition-all shadow-sm disabled:opacity-50 ${
                gpsStatus === 'linked' && followGpsMode
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20'
              }`}
            >
              {gpsStatus === 'linked' && followGpsMode ? (
                <LocateFixed className="w-4 h-4" />
              ) : (
                <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              )}
              <span>
                {isLocating
                  ? 'Linking GPS...'
                  : gpsStatus === 'linked' && followGpsMode
                  ? 'Re-center on Me'
                  : gpsStatus === 'linked'
                  ? 'Back to My Position'
                  : 'Link My Position'}
              </span>
            </button>

            <button
              onClick={() =>
                loadNearbyFacilities(
                  currentCoords.lat,
                  currentCoords.lng,
                  searchRadius,
                  selectedType
                )
              }
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Refresh nearby facilities"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Autocomplete Search & Presets */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              placeholder="Search city, neighborhood, or street address (Google Places Autocomplete)..."
              className="w-full pl-10 pr-24 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
            >
              Search
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full mt-1 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                {suggestions.map((sug, idx) => (
                  <li
                    key={sug.placePrediction?.placeId || idx}
                    onClick={() => handleSelectSuggestion(sug)}
                    className="px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-2 border-b last:border-b-0 border-slate-100 dark:border-slate-800"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{sug.placePrediction?.text.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </form>

          {/* City Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            <span className="text-slate-400 font-medium whitespace-nowrap pl-1">
              Presets:
            </span>
            {PRESET_CITIES.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => handleSelectCity(c)}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  locationName.includes(c.name.split(',')[0])
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {c.name.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Badges & Radius Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Types ({facilities.length})
            </button>

            <button
              onClick={() => setSelectedType('pharmacy')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                selectedType === 'pharmacy'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Pharmacies</span>
            </button>

            <button
              onClick={() => setSelectedType('clinic')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                selectedType === 'clinic'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Walk-in Clinics</span>
            </button>

            <button
              onClick={() => setSelectedType('urgent_care')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                selectedType === 'urgent_care'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Urgent Care{urgentCareCount > 0 ? ` (${urgentCareCount})` : ''}</span>
            </button>

            <button
              onClick={() => setSelectedType('hospital')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                selectedType === 'hospital'
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100'
              }`}
            >
              <Hospital className="w-3.5 h-3.5" />
              <span>24/7 Hospitals</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyOpenNow}
                onChange={(e) => setOnlyOpenNow(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Open Now Only
              </span>
            </label>

            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              <span className="text-slate-500">Radius:</span>
              <select
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value={3}>3 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={15}>15 km</option>
                <option value={25}>25 km</option>
              </select>
            </div>
          </div>
        </div>

        {apiError && (
          <div className="mt-3 px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{apiError}</span>
            </div>
            {(gpsStatus === 'denied' || gpsStatus === 'unavailable') && (
              <button
                type="button"
                onClick={() => requestAndLinkPosition(true)}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold whitespace-nowrap transition"
              >
                Retry GPS
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Google Map & Directory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Side: Google Map Container with explicit height (CF2) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm relative h-[480px] lg:h-[640px]">
          <GoogleMap
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={13}
            mapId="DEMO_MAP_ID"
            colorScheme={isDarkMode ? 'DARK' : 'LIGHT'}
            gestureHandling="greedy"
            clickableIcons={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            onClick={() => {
              setSelectedFacility(null);
              setSelectedMarker(null);
            }}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Live User GPS Marker (Blue/Cyan pulsing dot) */}
            {userGpsCoords && (
              <AdvancedMarker
                position={{ lat: userGpsCoords.lat, lng: userGpsCoords.lng }}
                zIndex={600}
                title="Your Live GPS Position"
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-cyan-400 opacity-75" />
                  <span className="absolute inline-flex h-6 w-6 rounded-full bg-cyan-500/25 border border-cyan-400" />
                  <div className="relative w-4 h-4 rounded-full bg-cyan-600 border-2 border-white shadow-lg" />
                </div>
              </AdvancedMarker>
            )}

            {/* Search Area Center Pin when browsing away from GPS or before GPS lock */}
            {(!userGpsCoords || !followGpsMode) && (
              <AdvancedMarker
                position={currentCoords}
                zIndex={500}
                title={userGpsCoords ? 'Search Area Center' : 'Active Search Center'}
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-emerald-400 opacity-50" />
                  <div className="relative w-5 h-5 rounded-full bg-slate-900 dark:bg-white border-2 border-emerald-500 shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </AdvancedMarker>
            )}

            {/* Facility Markers */}
            {filteredFacilities.map((facility, idx) => (
              <FacilityAdvancedMarker
                key={facility.id}
                facility={facility}
                isSelected={selectedFacility?.id === facility.id}
                zIndex={idx + 1}
                onMarkerClick={handleMarkerClick}
              />
            ))}

            {/* InfoWindow anchored to selected marker or positioned at card selection */}
            {selectedFacility && (
              <InfoWindow
                anchor={selectedMarker || undefined}
                position={
                  selectedMarker
                    ? undefined
                    : { lat: selectedFacility.lat, lng: selectedFacility.lng }
                }
                pixelOffset={[0, -6]}
                onCloseClick={() => {
                  setSelectedFacility(null);
                  setSelectedMarker(null);
                }}
              >
                <div className="p-2.5 max-w-xs font-sans rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                        selectedFacility.type === 'hospital'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : selectedFacility.type === 'urgent_care'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : selectedFacility.type === 'pharmacy'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {selectedFacility.primaryTypeLabel ||
                        selectedFacility.type.replace('_', ' ')}
                    </span>
                    {selectedFacility.rating !== undefined && (
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                        ★ {selectedFacility.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {selectedFacility.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {selectedFacility.address}
                  </p>
                  <div className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        selectedFacility.isOpenNow === true
                          ? 'bg-emerald-500'
                          : selectedFacility.isOpenNow === false
                          ? 'bg-rose-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    <span>{selectedFacility.statusText}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {selectedFacility.phone && (
                      <a
                        href={`tel:${selectedFacility.phone}`}
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700"
                      >
                        Call
                      </a>
                    )}
                    <a
                      href={selectedFacility.directionsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-slate-900 dark:bg-slate-700 text-white rounded text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>

          {/* Map floating legend */}
          <div className="absolute top-3 left-3 right-14 sm:right-auto z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 text-[11px] flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-300/60" />
              <span className="font-semibold text-amber-700 dark:text-amber-300">Urgent Care</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-600 dark:text-slate-300">Hospital</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-300">Pharmacy</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-600 dark:text-slate-300">Clinic</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span className="text-slate-600 dark:text-slate-300">You</span>
            </div>
          </div>

          {/* Floating Center on My Live Position control */}
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            title="Center map on my live GPS position"
            className={`absolute bottom-6 left-3 z-10 inline-flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg border text-xs font-semibold transition active:scale-95 ${
              gpsStatus === 'linked' && followGpsMode
                ? 'bg-white/95 dark:bg-slate-900/95 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700'
                : 'bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500'
            }`}
          >
            <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>
              {isLocating
                ? 'Locating...'
                : gpsStatus === 'linked' && followGpsMode
                ? 'My Position Linked'
                : 'Center on My Position'}
            </span>
          </button>

          {isLoading && (
            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-xs flex items-center justify-center z-20">
              <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-emerald-500 animate-spin" />
                <span className="text-sm font-semibold text-slate-800 dark:text-white">
                  Fetching live Google Places & hours...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Scrollable Facility Cards with Verified Google Hours */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3 max-h-[640px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              Showing{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {filteredFacilities.length}
              </strong>{' '}
              verified Google Places
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Live Google operating hours
            </span>
          </div>

          {filteredFacilities.length === 0 && !isLoading ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
              <Hospital className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                No facilities found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                No matching care centers within {searchRadius} km. Try expanding
                the radius or clearing &quot;Open Now Only&quot;.
              </p>
              <button
                onClick={() => {
                  setOnlyOpenNow(false);
                  setSelectedType('all');
                  setSearchRadius(15);
                }}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredFacilities.map((facility) => {
              const isSelected = selectedFacility?.id === facility.id;
              const isHoursExpanded = expandedHoursId === facility.id;

              return (
                <div
                  key={facility.id}
                  onClick={() => handleCardClick(facility)}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 dark:border-emerald-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          facility.type === 'hospital'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                            : facility.type === 'pharmacy'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                            : facility.type === 'urgent_care'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                        }`}
                      >
                        {facility.primaryTypeLabel ||
                          facility.type.replace('_', ' ')}
                      </span>

                      {facility.distanceKm !== undefined && (
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {facility.distanceKm} km away
                        </span>
                      )}
                    </div>

                    {facility.rating !== undefined && (
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <span>★</span>
                        <span>{facility.rating.toFixed(1)}</span>
                        {facility.reviewsCount !== undefined && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({facility.reviewsCount})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1.5 leading-snug">
                    {facility.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{facility.address}</span>
                  </div>

                  {/* Live Google Operating Hours */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold min-w-0">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span
                        className={`truncate ${
                          facility.statusBadgeColor === 'emerald'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : facility.statusBadgeColor === 'amber'
                            ? 'text-amber-600 dark:text-amber-400'
                            : facility.statusBadgeColor === 'blue'
                            ? 'text-blue-600 dark:text-blue-400'
                            : facility.statusBadgeColor === 'rose'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {facility.statusText}
                      </span>
                    </div>

                    {facility.weekdayDescriptions &&
                      facility.weekdayDescriptions.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedHoursId(isHoursExpanded ? null : facility.id);
                          }}
                          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-0.5 shrink-0"
                        >
                          <span>Hours</span>
                          {isHoursExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                  </div>

                  {/* Expandable 7-Day Schedule */}
                  {isHoursExpanded && facility.weekdayDescriptions && (
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                      {facility.weekdayDescriptions.map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-3.5 flex items-center gap-2">
                    <a
                      href={facility.directionsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold transition"
                    >
                      <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Directions</span>
                    </a>

                    {facility.phone && (
                      <a
                        href={`tel:${facility.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    )}

                    {facility.googleMapsUri && (
                      <a
                        href={facility.googleMapsUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                        title="Open in Google Maps"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
