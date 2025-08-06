/**
 * Network monitoring utility using Performance API
 * Monitors network requests and provides callbacks for matching patterns
 */
export class NetworkMonitor {
  private observer: PerformanceObserver | null = null
  private processedUrls = new Set<string>()
  private urlPatterns: string[] = []
  private callback: ((url: string, details: any) => void) | null = null

  constructor() {}

  public startMonitoring(
    patterns: string[],
    onRequestDetected: (url: string, details: any) => void
  ): void {
    this.urlPatterns = patterns
    this.callback = onRequestDetected

    // Check existing resource entries first (for already loaded resources)
    this.checkExistingResources()

    // Set up PerformanceObserver to monitor new resource entries
    if ("PerformanceObserver" in window) {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === "resource") {
            this.checkResourceEntry(entry as PerformanceResourceTiming)
          }
        })
      })

      // Start observing resource entries
      this.observer.observe({ entryTypes: ["resource"] })
    } else {
      console.warn("PerformanceObserver not supported in this browser")
    }
  }

  public stopMonitoring(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    this.processedUrls.clear()
    this.urlPatterns = []
    this.callback = null
  }

  private checkExistingResources(): void {
    const resourceEntries = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[]
    resourceEntries.forEach((entry) => {
      this.checkResourceEntry(entry)
    })
  }

  private checkResourceEntry(entry: PerformanceResourceTiming): void {
    const url = entry.name

    // Check if this URL matches any of our patterns
    const matchesPattern = this.urlPatterns.some((pattern) =>
      this.matchesUrlPattern(url, pattern)
    )

    if (matchesPattern) {
      // Avoid processing the same URL multiple times
      if (!this.processedUrls.has(url)) {
        this.processedUrls.add(url)

        if (this.callback) {
          this.callback(url, {
            startTime: entry.startTime,
            duration: entry.duration,
            responseEnd: entry.responseEnd,
            initiatorType: entry.initiatorType,
            transferSize: entry.transferSize,
            encodedBodySize: entry.encodedBodySize,
            decodedBodySize: entry.decodedBodySize
          })
        }
      }
    }
  }

  /**
   * Check if a URL matches a given pattern
   * Supports basic wildcard matching with *
   */
  private matchesUrlPattern(url: string, pattern: string): boolean {
    // Convert pattern to regex
    // Replace * with .* for wildcard matching
    const regexPattern = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // Escape regex special chars
      .replace(/\\\*/g, ".*") // Convert \* back to .* for wildcards

    const regex = new RegExp(regexPattern, "i") // Case insensitive
    return regex.test(url)
  }
}
