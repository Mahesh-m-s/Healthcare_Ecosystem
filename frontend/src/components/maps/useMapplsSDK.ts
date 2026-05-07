// Dynamically loads the Mappls JS SDK and resolves when ready.
// The SDK script is appended only once — safe to call from multiple components.

import { useEffect, useState } from 'react'
import { MAPPLS_KEY } from '../../config/constants'

let sdkLoaded = false
let sdkCallbacks: Array<() => void> = []

function onSdkReady(cb: () => void) {
  if (sdkLoaded) { cb(); return }
  sdkCallbacks.push(cb)
}

export function useMapplsSDK(): boolean {
  const [ready, setReady] = useState(sdkLoaded)

  useEffect(() => {
    if (!MAPPLS_KEY) return
    if (sdkLoaded) { setReady(true); return }

    // Already loading — just queue callback
    if (document.getElementById('mappls-sdk')) {
      onSdkReady(() => setReady(true))
      return
    }

    // Inject Mappls JS SDK script
    const script = document.createElement('script')
    script.id  = 'mappls-sdk'
    script.src = `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_KEY}/map_load?v=1.5&plugins=search,direction`
    script.async = true
    script.onload = () => {
      sdkLoaded = true
      sdkCallbacks.forEach(fn => fn())
      sdkCallbacks = []
    }
    document.head.appendChild(script)

    onSdkReady(() => setReady(true))
  }, [])

  return ready
}
