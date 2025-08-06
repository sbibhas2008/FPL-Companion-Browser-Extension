import { EventName } from "./constants"

export interface EventListener<T = any> {
  eventName: EventName
  listener: (detail: T) => void
}

// TODO: Create a separate class for handling each event
// TODO: Implement logic to call FPL API to fetch player data and render on the FPL app
export function handlePlayerClickedEvent(detail: {
  playerId: string
  url: string
}): void {
  const { playerId, url } = detail
  console.log(`Custom event received - Player ID: ${playerId}, URL: ${url}`)
}

export function addCustomEventListener<T = any>(
  eventType: string,
  listener: (detail: T) => void
): void {
  document.addEventListener(eventType, (event: CustomEvent<T>) => {
    listener(event.detail)
  })
}

export function initializeEventListeners(
  eventsWithListeners: EventListener[]
): void {
  eventsWithListeners.forEach(({ eventName, listener }) => {
    addCustomEventListener(eventName, listener)
  })
}
