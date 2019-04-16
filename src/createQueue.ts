export interface Queue<T> {
  enqueue(item: T): void
  dequeue(): T | undefined
  readonly length: number
}

export function createQueue<T>(): Queue<T> {
  const trimLimit = 10000
  const store: T[] = []
  let front = 0
  let end = 0
  const enqueue = function(data: T): void {
    store[end] = data
    end++
  }
  const dequeue = function(): T | undefined {
    if (front === end) return undefined

    const data = store[front]
    delete store[front]
    ++front
    if (front > trimLimit) {
      store.splice(0, trimLimit)
      front -= trimLimit
      end -= trimLimit
    }
    return data
  }
  const length = (): number => end - front
  return {
    enqueue,
    dequeue,
    get length() {
      return length()
    }
  }
}
