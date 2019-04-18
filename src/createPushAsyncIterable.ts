import { createAsyncQueue } from './createAsyncQueue'

export async function* createPushAsyncIterable<T>(
  subscriber: (
    next: (item: T) => void,
    complete: () => void,
    error: (reason: any) => void,
    addCompletionHandler: (handler: () => void) => void
  ) => void
) {
  const q = createAsyncQueue<T>()
  const unsubscriptions: (() => void)[] = []

  subscriber(q.enqueue, q.complete, q.error, (handler: () => void) => unsubscriptions.push(handler))
  try {
    for await (const x of q) {
      yield x
    }
  } finally {
    unsubscriptions.forEach(f => f())
  }
}
