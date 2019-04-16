import { IteratorResultResolver } from './IteratorResultResolver'
import { ResultWaitingForResolver } from './ResultWaitingForResolver'
import { createPromiseResolver } from './createPromiseResolver'
import { AsyncIterableQueue } from './AsyncIterableQueue'
import { Queue, createQueue } from './createQueue'
export function createAsyncQueue<T>(): AsyncIterableQueue<T> {
  const pendingResolvers: Queue<IteratorResultResolver<T>> = createQueue()
  const resultsWaitingForResolvers: Queue<ResultWaitingForResolver<T>> = createQueue()
  const next = () => {
    const pr = createPromiseResolver<IteratorResult<T>>()
    if (resultsWaitingForResolvers.length > 0) {
      const f: ResultWaitingForResolver<T> = resultsWaitingForResolvers.dequeue()!
      f(pr.resolve)
    } else {
      pendingResolvers.enqueue(pr.resolve)
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
  const getNextResultResolver = async () => {
    if (pendingResolvers.length > 0) {
      const resolver = pendingResolvers.dequeue()!
      return resolver
    } else {
      const pr = createPromiseResolver<IteratorResultResolver<T>>()
      resultsWaitingForResolvers.enqueue(pr.resolve)
      return pr.promise
    }
  }
  const enqueue = async (value: T) => {
    const resolveResult = await getNextResultResolver()
    resolveResult({ value, done: false })
  }
  const complete = async () => {
    const resolveResult = await getNextResultResolver()
    resolveResult({ done: true } as IteratorResult<T>)
  }
  return {
    [Symbol.asyncIterator](): AsyncIterableIterator<T> {
      return this
    },
    next,
    dequeue,
    enqueue,
    complete
  }
}
