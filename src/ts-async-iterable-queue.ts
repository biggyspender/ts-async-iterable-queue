/* istanbul ignore if */
if (!Symbol.asyncIterator) {
  const aiKey = 'asyncIterator'
  ;(Symbol as any)[aiKey] = Symbol.for('Symbol.asyncIterator')
}
export { createAsyncQueue } from './createAsyncQueue'
export { AsyncIterableQueue } from './AsyncIterableQueue'
export { createQueue, Queue } from './createQueue'
export { createPushAsyncIterable } from './createPushAsyncIterable'
export { createPromiseResolver } from './createPromiseResolver'
export { PromiseResolver } from './PromiseResolver'
