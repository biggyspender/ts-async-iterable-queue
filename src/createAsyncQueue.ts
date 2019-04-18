import { createPromiseResolver } from './createPromiseResolver'
import { AsyncIterableQueue } from './AsyncIterableQueue'
import { Queue, createQueue } from './createQueue'
import { PromiseResolver } from './PromiseResolver'
export function createAsyncQueue<T>(): AsyncIterableQueue<T> {
  const pendingResolvers: Queue<PromiseResolver<IteratorResult<T>>> = createQueue()
  const resultsWaitingForResolvers: Queue<
    PromiseResolver<PromiseResolver<IteratorResult<T>>>
  > = createQueue()
  const next = (): Promise<IteratorResult<T>> => {
    const pr = createPromiseResolver<IteratorResult<T>>()
    if (resultsWaitingForResolvers.length > 0) {
      const f: PromiseResolver<
        PromiseResolver<IteratorResult<T>>
      > = resultsWaitingForResolvers.dequeue()!
      f.resolve(pr)
    } else {
      pendingResolvers.enqueue(pr)
    }
    return pr.promise
  }
  const dequeue = async () => {
    const result = await next()
    if (result.done) {
      throw Error('queue is complete')
    }
    return result.value
  }
  const getNextResultResolver = async (): Promise<PromiseResolver<IteratorResult<T>>> => {
    if (pendingResolvers.length > 0) {
      const resolver = pendingResolvers.dequeue()!
      return resolver
    } else {
      const pr = createPromiseResolver<PromiseResolver<IteratorResult<T>>>()
      resultsWaitingForResolvers.enqueue(pr)
      return pr.promise
    }
  }
  const enqueue = async (value: T): Promise<void> => {
    const resolveResult = await getNextResultResolver()
    resolveResult.resolve({ value, done: false })
  }
  const complete = async (): Promise<void> => {
    const resolveResult = await getNextResultResolver()
    resolveResult.resolve({ done: true } as IteratorResult<T>)
  }

  const error = async (reason?: any): Promise<void> => {
    const resolveResult = await getNextResultResolver()
    resolveResult.reject(reason)
  }

  return {
    [Symbol.asyncIterator](): AsyncIterableIterator<T> {
      return this
    },
    next,
    dequeue,
    enqueue,
    complete,
    error
  }
}
