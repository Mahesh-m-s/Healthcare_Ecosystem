import { useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'
import { MAPPLS_KEY } from '../../config/constants'
import { useMapplsSDK } from './useMapplsSDK'
import type { HospitalWithEta } from '../../types/emergency.types'

interface Props {
  center: { lat: number; lng: number }
  hospitals: HospitalWithEta[]
  onSelect?: (hospital: HospitalWithEta) => void
}

declare const mappls: any

export default function NearbyHospitalsMap({ center, hospitals, onSelect }: Props) {
  const mapRef     = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markers    = useRef<any[]>([])
  const sdkReady   = useMapplsSDK()

  // Initialise map once SDK is ready
  useEffect(() => {
    if (!sdkReady || !mapRef.current) return
    mapInstance.current = new mappls.Map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom:   13,
      search: false,
    })

    // User location marker (blue circle)
    new mappls.Marker({
      map:      mapInstance.current,
      position: { lat: center.lat, lng: center.lng },
      popupHtml: '<strong>Your location</strong>',
      icon: {
        url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="%234F8CFF" stroke="white" stroke-width="2"/></svg>',
        width: 24, height: 24,
      },
    })
  }, [sdkReady])

  // Add/refresh hospital markers when list changes
  useEffect(() => {
    if (!sdkReady || !mapInstance.current) return

    // Remove old markers
    markers.current.forEach(m => m.remove())
    markers.current = []

    hospitals.forEach(h => {
      const marker = new mappls.Marker({
        map:      mapInstance.current,
        position: { lat: h.lat, lng: h.lng },
        popupHtml: `<div style="font-family:Inter,sans-serif;min-width:160px">
          <strong>${h.name}</strong><br/>
          <small>${h.distance_km?.toFixed(1) ?? '?'} km &bull; ETA ${h.eta_minutes ?? '?'} min &bull; ${h.available_beds ?? '?'} beds free</small>
        </div>`,
        icon: {
          url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="14" fill="%23FF4B4B" opacity="0.9"/><text x="50%25" y="57%25" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="15" font-weight="bold">H</text></svg>',
          width: 32, height: 32,
        },
      })
      marker.addListener('click', () => onSelect?.(h))
      markers.current.push(marker)
    })
  }, [sdkReady, hospitals])

  if (!MAPPLS_KEY) {
    return (
      <div className="w-full h-full bg-va-gray-light dark:bg-dark-surface rounded-va flex flex-col items-center justify-center gap-2 text-va-gray-text">
        <MapPin className="w-8 h-8 opacity-40" />
        <span className="text-sm font-medium">Mappls key not configured</span>
        <span className="text-xs">Add VITE_MAPPLS_KEY to your .env file</span>
      </div>
    )
  }

  if (!sdkReady) {
    return (
      <div className="w-full h-full bg-va-gray-light dark:bg-dark-surface rounded-va flex items-center justify-center text-va-gray-text text-sm">
        Loading map…
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-full rounded-va overflow-hidden" />
}
