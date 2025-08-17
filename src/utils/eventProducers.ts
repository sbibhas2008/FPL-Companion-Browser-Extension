import { type EventProducer } from "~src/events"

export function initializeEventProducers(
  eventProducers: EventProducer[]
): void {
  eventProducers.forEach((producer) => producer.initialize())
}

export function cleanupEventProducers(eventProducers: EventProducer[]): void {
  eventProducers.forEach((producer) => producer.destroy())
}
