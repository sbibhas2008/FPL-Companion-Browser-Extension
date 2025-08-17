/**
 * Generic interface for event producers in the extension
 * Event producers are responsible for detecting specific user interactions
 * and dispatching events that other parts of the extension can listen to
 */
export interface EventProducer {
  /**
   * Initialize the event producer and start listening/detecting events
   */
  initialize(): void

  /**
   * Stop the event producer and cleanup any resources
   */
  destroy(): void

  /**
   * Get the initialization status
   */
  get initialized(): boolean
}
