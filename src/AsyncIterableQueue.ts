export interface AsyncIterableQueue<T> extends AsyncIterableIterator<T> {
  enqueue(item: T): void
  dequeue(): Promise<T>
  complete(): void
  error(reason: any): void
}
