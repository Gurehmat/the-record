const MAX_CALLS = 10
const WINDOW_MS = 60_000
const callTimestamps: number[] = []
let reservationQueue: Promise<void> = Promise.resolve()

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function pruneOldCalls(now: number) {
  while (callTimestamps.length > 0 && now - callTimestamps[0] >= WINDOW_MS) {
    callTimestamps.shift()
  }
}

async function reserveCallSlot() {
  while (true) {
    const now = Date.now()
    pruneOldCalls(now)

    if (callTimestamps.length < MAX_CALLS) {
      callTimestamps.push(now)
      return
    }

    const oldestCall = callTimestamps[0]
    const waitMs = Math.max(WINDOW_MS - (now - oldestCall), 0) + 50
    await sleep(waitMs)
  }
}

export async function rateLimitedCall<T>(fn: () => Promise<T>): Promise<T> {
  const reservation = reservationQueue.then(reserveCallSlot)
  reservationQueue = reservation.catch(() => undefined)
  await reservation
  return fn()
}
