export interface Subscription<T> {
  next: (item: T) => void
  complete: () => void
  error: (reason: any) => void
  addCompletionHandler: (handler: () => void) => void
}
