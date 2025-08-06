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
    // Start monitoring FPL element-summary API requests
    this.networkMonitor.startMonitoring(
      ["*://fantasy.premierleague.com/api/element-summary/*"],
      (url: string) => {
        this.handleNetworkRequest(url)
      }
    )
  }

  public get initialized(): boolean {
    return this.isInitialized
  }

  private extractPlayerIdFromUrl(url: string): string | null {
    // Match patterns like: https://fantasy.premierleague.com/api/element-summary/{player_id}/
    const playerIdMatch = url.match(/\/api\/element-summary\/(\d+)\//)
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
