/* istanbul ignore if */
if (!Symbol.asyncIterator) {
  const aiKey = 'asyncIterator'
  ;(Symbol as any)[aiKey] = Symbol.for('Symbol.asyncIterator')
}
export { createAsyncQueue } from './createAsyncQueue'
export { createQueue } from './createQueue'
