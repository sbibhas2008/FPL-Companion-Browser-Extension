import { EventName } from "~src/utils/constants"

import { NetworkMonitor } from "../monitoring"
import type { EventProducer } from "./EventProducer"

/**
 * Event producer that detects when FPL players are clicked
 * Uses NetworkMonitor to detect FPL element-summary API requests
 */
export class PlayerClickedEventProducer implements EventProducer {
  private isInitialized = false
  private networkMonitor: NetworkMonitor
  private readonly EVENT_NAME = EventName.FPL_PLAYER_CLICKED
  private ApiUrlPattern = "*://fantasy.premierleague.com/api/element-summary/*"
  // Match patterns like: https://fantasy.premierleague.com/api/element-summary/{player_id}/
  private readonly ApiUrlRegex = /\/api\/element-summary\/(\d+)\//

  constructor() {
    this.networkMonitor = new NetworkMonitor()
  }

  public initialize(): void {
    if (this.isInitialized) {
      console.warn("PlayerClickedEventProducer already initialized")
      return
    }

    this.setupNetworkMonitoring()
    this.isInitialized = true
  }

  public destroy(): void {
    if (this.isInitialized) {
      // Stop network monitoring
      this.networkMonitor.stopMonitoring()
      this.isInitialized = false
    }
  }

  private setupNetworkMonitoring(): void {
    this.networkMonitor.startMonitoring([this.ApiUrlPattern], (url: string) => {
      this.handleNetworkRequest(url)
    })
  }

  public get initialized(): boolean {
    return this.isInitialized
  }

  private extractPlayerIdFromUrl(url: string): string | null {
    const playerIdMatch = url.match(this.ApiUrlRegex)
    if (playerIdMatch) {
      return playerIdMatch[1]
    }
    return null
  }

  private handleNetworkRequest(url: string): void {
    const playerId = this.extractPlayerIdFromUrl(url)
    if (playerId) {
      this.handlePlayerDetection(playerId, url)
    }
  }

  private handlePlayerDetection(playerId: string, url: string): void {
    // Dispatch custom event that other parts of the extension can listen to
    const event = new CustomEvent(this.EVENT_NAME, {
      detail: { playerId, url }
    })
    document.dispatchEvent(event)
  }
}
