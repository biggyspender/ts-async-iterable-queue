export interface Subscription<T> {
  next: (item: T) => void
  complete: (value?: any, immediate?: boolean) => void
  error: (reason?: any, immediate?: boolean) => void
  addCompletionHandler: (handler: () => void) => void
}
