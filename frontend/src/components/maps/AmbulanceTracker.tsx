import { useEffect, useRef } from 'react'
import { Ambulance } from 'lucide-react'
import { MAPPLS_KEY } from '../../config/constants'
import { useMapplsSDK } from './useMapplsSDK'
import type { LatLng } from '../../types/emergency.types'

interface Props {
  patientLocation:   LatLng
  ambulanceLocation: LatLng | null
  hospitalLocation?: LatLng
}

declare const mappls: any

export default function AmbulanceTracker({ patientLocation, ambulanceLocation, hospitalLocation }: Props) {
  const mapRef          = useRef<HTMLDivElement>(null)
  const mapInstance     = useRef<any>(null)
  const ambulanceMarker = useRef<any>(null)
  const sdkReady        = useMapplsSDK()

  useEffect(() => {
    if (!sdkReady || !mapRef.current) return

    mapInstance.current = new mappls.Map(mapRef.current, {
      center: [patientLocation.lat, patientLocation.lng],
      zoom:   14,
      search: false,
    })

    // Patient marker (blue)
    new mappls.Marker({
      map:      mapInstance.current,
      position: { lat: patientLocation.lat, lng: patientLocation.lng },
      popupHtml: '<strong>Patient location</strong>',
      icon: {
        url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="%234F8CFF" stroke="white" stroke-width="2"/></svg>',
        width: 24, height: 24,
      },
    })

    // Hospital marker if available
    if (hospitalLocation) {
      new mappls.Marker({
        map:      mapInstance.current,
        position: { lat: hospitalLocation.lat, lng: hospitalLocation.lng },
        popupHtml: '<strong>Hospital</strong>',
        icon: {
          url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect x="2" y="2" width="28" height="28" rx="4" fill="%232ECC71"/><text x="50%25" y="57%25" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="15" font-weight="bold">H</text></svg>',
          width: 32, height: 32,
        },
      })
    }

    // Ambulance marker
    if (ambulanceLocation) {
      ambulanceMarker.current = new mappls.Marker({
        map:      mapInstance.current,
        position: { lat: ambulanceLocation.lat, lng: ambulanceLocation.lng },
        popupHtml: '<strong>🚑 Ambulance</strong>',
        icon: {
          url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><circle cx="18" cy="18" r="16" fill="%23FF4B4B"/><text x="50%25" y="57%25" dominant-baseline="middle" text-anchor="middle" font-size="18">🚑</text></svg>',
          width: 36, height: 36,
        },
      })
    }
  }, [sdkReady])

  // Smoothly update ambulance position as it moves
  useEffect(() => {
    if (!sdkReady || !mapInstance.current || !ambulanceLocation) return

    if (ambulanceMarker.current) {
      ambulanceMarker.current.setPosition({ lat: ambulanceLocation.lat, lng: ambulanceLocation.lng })
    } else {
      ambulanceMarker.current = new mappls.Marker({
        map:      mapInstance.current,
        position: { lat: ambulanceLocation.lat, lng: ambulanceLocation.lng },
        icon: {
          url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><circle cx="18" cy="18" r="16" fill="%23FF4B4B"/><text x="50%25" y="57%25" dominant-baseline="middle" text-anchor="middle" font-size="18">🚑</text></svg>',
          width: 36, height: 36,
        },
      })
    }
    mapInstance.current.setCenter([ambulanceLocation.lat, ambulanceLocation.lng])
  }, [sdkReady, ambulanceLocation?.lat, ambulanceLocation?.lng])

  if (!MAPPLS_KEY) {
    return (
      <div className="w-full h-full bg-va-gray-light dark:bg-dark-surface rounded-va flex flex-col items-center justify-center gap-2 text-va-gray-text">
        <Ambulance className="w-8 h-8 opacity-40" />
        <span className="text-sm">Ambulance tracking unavailable</span>
        <span className="text-xs">Add VITE_MAPPLS_KEY to .env</span>
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
