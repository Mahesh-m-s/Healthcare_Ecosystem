import AmbulanceTracker from './AmbulanceTracker'
import NearbyHospitalsMap from './NearbyHospitalsMap'
import type { LatLng, HospitalWithEta } from '../../types/emergency.types'

interface Props {
  mode:              'ambulance' | 'nearby'
  center:            LatLng
  ambulanceLocation?: LatLng | null
  hospitals?:        HospitalWithEta[]
  onSelectHospital?: (h: HospitalWithEta) => void
  className?:        string
}

export default function EmergencyMap({
  mode, center, ambulanceLocation, hospitals = [], onSelectHospital, className = 'h-64'
}: Props) {
  return (
    <div className={`${className} w-full`}>
      {mode === 'ambulance' ? (
        <AmbulanceTracker
          patientLocation={center}
          ambulanceLocation={ambulanceLocation ?? null}
        />
      ) : (
        <NearbyHospitalsMap
          center={center}
          hospitals={hospitals}
          onSelect={onSelectHospital}
        />
      )}
    </div>
  )
}
