import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Star, Phone, Navigation, Search, Loader2 } from 'lucide-react'
import { useEmergencyStore } from '../../store/emergencyStore'
import NearbyHospitalsMap from '../../components/maps/NearbyHospitalsMap'
import { MAPPLS_KEY } from '../../config/constants'

export default function HospitalFinder() {
  const { nearbyHospitals, isLoadingHospitals, loadNearbyHospitals, getCurrentLocation, currentLocation } = useEmergencyStore()
  const [search, setSearch]     = useState('')
  const [locError, setLocError] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    getCurrentLocation().then(loc => {
      if (loc) loadNearbyHospitals(loc.lat, loc.lng)
      else setLocError(true)
    })
  }, [])

  const filtered = nearbyHospitals.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    (h.address || '').toLowerCase().includes(search.toLowerCase())
  )

  const navigate = (h: typeof nearbyHospitals[0]) => {
    if (!currentLocation) return
    const url = `https://mappls.com/direction?start=${currentLocation.lat},${currentLocation.lng}&end=${h.lat},${h.lng}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-va-charcoal dark:text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-va-success" /> Find Hospitals
        </h1>
        <p className="text-sm text-va-gray-text mt-0.5">Nearby hospitals ranked by distance and ETA</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-va-gray-text" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search hospitals..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-card border border-va-gray-light dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
        />
      </div>

      {/* Mappls Map */}
      {currentLocation ? (
        <div className="h-56 rounded-va-lg overflow-hidden border border-va-gray-light dark:border-dark-border">
          <NearbyHospitalsMap
            center={currentLocation}
            hospitals={filtered}
            onSelect={h => setSelected(h.placeId)}
          />
        </div>
      ) : !MAPPLS_KEY ? (
        <div className="bg-va-mint rounded-va-lg h-40 flex flex-col items-center justify-center gap-1 border border-emerald-200">
          <MapPin className="w-7 h-7 text-va-success opacity-50" />
          <p className="text-xs text-va-gray-text">Add VITE_MAPPLS_KEY to .env to enable the map</p>
        </div>
      ) : null}

      {/* Hospital list */}
      {locError ? (
        <div className="bg-amber-50 border border-amber-200 rounded-va p-5 text-center">
          <p className="text-sm font-semibold text-amber-700">Location access denied</p>
          <p className="text-xs text-amber-600 mt-1">Enable location permissions to see nearby hospitals</p>
        </div>
      ) : isLoadingHospitals ? (
        <div className="flex items-center justify-center py-12 gap-2 text-va-gray-text">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Finding hospitals near you…</span>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((h, i) => (
            <motion.div
              key={h.placeId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white dark:bg-dark-card rounded-va border transition-all p-4 ${
                selected === h.placeId
                  ? 'border-va-blue shadow-va-hover'
                  : 'border-va-gray-light dark:border-dark-border hover:shadow-va-card'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-va flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-va-success" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-va-charcoal dark:text-white">{h.name}</p>
                    <p className="text-xs text-va-gray-text mt-0.5">{h.address}</p>
                    {h.available_beds != null && (
                      <p className="text-xs text-va-blue mt-0.5">{h.available_beds} beds available</p>
                    )}
                    {h.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-va-gray-text font-medium">{h.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {h.eta_minutes != null && (
                    <div className="flex items-center gap-1 text-sm font-bold text-va-emergency">
                      <Clock className="w-3.5 h-3.5" /> {h.eta_minutes} min
                    </div>
                  )}
                  {h.distance_km != null && (
                    <p className="text-xs text-va-gray-text">{h.distance_km.toFixed(1)} km</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate(h)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-va-blue text-white rounded-va text-xs font-bold hover:bg-opacity-90 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" /> Navigate
                </button>
                {(h as any).phone && (
                  <a
                    href={"tel:" + (h as any).phone}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-va-gray-light dark:bg-dark-surface border border-va-gray-light dark:border-dark-border text-va-gray-text rounded-va text-xs font-bold hover:border-va-blue hover:text-va-blue transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                )}
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && !isLoadingHospitals && (
            <div className="text-center py-12 text-va-gray-text">
              <MapPin className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <div className="text-sm">No hospitals found nearby</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
