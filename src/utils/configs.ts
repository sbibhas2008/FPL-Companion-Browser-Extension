import { PlayerClickedEventProducer, type EventProducer } from "~src/events"

import { EventName } from "./constants"
import { handlePlayerClickedEvent, type EventListener } from "./eventListeners"

export const getDefaultEventListeners = (): EventListener[] => [
  {
    eventName: EventName.FPL_PLAYER_CLICKED,
    listener: handlePlayerClickedEvent
  }
]

export const getDefaultEventProducers = (): EventProducer[] => [
  new PlayerClickedEventProducer()
]
