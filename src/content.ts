import { get } from "http"

import type { EventProducer } from "~src/events"
import {
  cleanupEventProducers,
  initializeEventListeners,
  initializeEventProducers,
  type EventListener
} from "~src/utils"

import {
  getDefaultEventListeners,
  getDefaultEventProducers
} from "./utils/configs"

console.log("🚀 FPL Companion content script loaded on:", window.location.href)

const eventProducers: EventProducer[] = getDefaultEventProducers()
const eventListeners: EventListener[] = getDefaultEventListeners()

function cleanup(): void {
  cleanupEventProducers(eventProducers)
}

export function initialize(): void {
  initializeEventProducers(eventProducers)
  initializeEventListeners(eventListeners)

  window.addEventListener("beforeunload", cleanup)
}

initialize()
