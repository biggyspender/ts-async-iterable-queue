import { createAsyncQueue } from './createAsyncQueue'
import { Subscription } from './Subscription'

export async function* createPushAsyncIterable<T>(subscriber: (s: Subscription<T>) => void) {
  const q = createAsyncQueue<T>()
  const unsubscriptions: (() => void)[] = []

  subscriber({
    next: q.enqueue,
    complete: q.complete,
    error: q.error,
    addCompletionHandler: (handler: () => void) => unsubscriptions.push(handler)
  })
  try {
    for await (const x of q) {
      yield x
    }
  } finally {
    unsubscriptions.forEach(f => f())
  }
}
