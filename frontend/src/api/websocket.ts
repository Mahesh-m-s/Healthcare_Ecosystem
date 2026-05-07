import { WS_BASE_URL, WS_EVENTS } from '../config/constants'

type WSEventType = typeof WS_EVENTS[keyof typeof WS_EVENTS]
type Handler = (data: unknown) => void

class VaidyaAstraWebSocket {
  private ws: WebSocket | null = null
  private handlers = new Map<string, Handler[]>()
  private reconnectAttempts = 0
  private maxReconnects = 10
  private pingInterval: ReturnType<typeof setInterval> | null = null

  constructor() {}

  connect() {
    const token = localStorage.getItem('va_access_token')
    const url = `${WS_BASE_URL}/ws?token=${encodeURIComponent(token || '')}`
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.startPing()
      console.log('[VA-WS] Connected')
    }

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const { event: type, data } = JSON.parse(event.data as string) as { event: string; data: unknown }
        this.handlers.get(type)?.forEach((h) => h(data))
      } catch { /* ignore malformed messages */ }
    }

    this.ws.onclose = () => {
      this.stopPing()
      if (this.reconnectAttempts < this.maxReconnects) {
        const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000)
        setTimeout(() => { this.reconnectAttempts++; this.connect() }, delay)
      }
    }

    this.ws.onerror = () => this.ws?.close()
  }

  on(event: WSEventType | string, handler: Handler) {
    if (!this.handlers.has(event)) this.handlers.set(event, [])
    this.handlers.get(event)!.push(handler)
    return this
  }

  off(event: string, handler: Handler) {
    const handlers = this.handlers.get(event) ?? []
    this.handlers.set(event, handlers.filter((h) => h !== handler))
  }

  send(event: string, data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, data }))
    }
  }

  disconnect() {
    this.stopPing()
    this.maxReconnects = 0
    this.ws?.close()
  }

  get isConnected() { return this.ws?.readyState === WebSocket.OPEN }

  private startPing() {
    this.pingInterval = setInterval(() => this.send('ping', {}), 30000)
  }
  private stopPing() {
    if (this.pingInterval) clearInterval(this.pingInterval)
  }
}

// Singleton factory
let instance: VaidyaAstraWebSocket | null = null
export const getWebSocket = (): VaidyaAstraWebSocket => {
  if (!instance) instance = new VaidyaAstraWebSocket()
  return instance
}
export const disconnectWebSocket = () => { instance?.disconnect(); instance = null }

export { VaidyaAstraWebSocket }
