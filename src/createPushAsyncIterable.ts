import { Subscription } from './Subscription'
import { PromiseResolver } from './PromiseResolver'
import { createPromiseResolver } from './createPromiseResolver'
import { createQueue } from './createQueue'

/* istanbul ignore next */
export async function* createPushAsyncIterable<T>(
  sub: (subscription: Subscription<T>) => void
): AsyncIterable<T> {
  const pullQueue = createQueue<PromiseResolver<IteratorResult<T>>>()
  const pushQueue = createQueue<Promise<IteratorResult<T>>>()
  let done = false
  const pushValue = async (item: T) => {
    if (pullQueue.length > 0) {
      const resolver = pullQueue.dequeue()!
      resolver.resolve({ done: false, value: item } as IteratorResult<T>)
    } else {
      pushQueue.enqueue(Promise.resolve({ done: false, value: item } as IteratorResult<T>))
    }
  }

  const pullValue = async (): Promise<IteratorResult<T>> => {
    if (pushQueue.length > 0) {
      const item = pushQueue.dequeue()!
      return item
    } else {
      const resolver = createPromiseResolver<IteratorResult<T>>()
      pullQueue.enqueue(resolver)
      return resolver.promise
    }
  }

  const completionHandlers: (() => void)[] = []
  const complete = (val?: any, immediate = false) => {
    done = true
    unsubscribe()
    if (immediate) {
      while (pullQueue.length > 0) {
        const x = pullQueue.dequeue()!
        x.resolve({ done, value: val } as IteratorResult<T>)
      }
    } else {
      pushQueue.enqueue(Promise.resolve({ done, value: val } as IteratorResult<T>))
    }
  }
  const error = (reason?: any, immediate = false) => {
    done = true
    unsubscribe()
    if (immediate) {
      while (pullQueue.length > 0) {
        const x = pullQueue.dequeue()!
        x.reject(reason)
      }
    } else {
      pushQueue.enqueue(Promise.reject(reason))
    }
  }
  let unsubscribed = false
  const unsubscribe = () => {
    if (!unsubscribed) {
      done = true
      unsubscribed = true
      completionHandlers.forEach(c => c())
    }
  }

  sub({ next: pushValue, complete, error, addCompletionHandler: h => completionHandlers.push(h) })

  const it: AsyncIterableIterator<T> = {
    [Symbol.asyncIterator]() {
      return this
    },
    next: () => pullValue(),
    return: async (val?: any) => {
      done = true
      complete(val, true)
      return { done } as IteratorResult<T>
    },
    throw: (reason?: any) => {
      done = true
      error(reason, true)
      return Promise.resolve({
        done
      } as IteratorResult<T>)
    }
  }
  try {
    for await (const x of it) {
      yield x
    }
  } finally {
    unsubscribe()
  }
}
