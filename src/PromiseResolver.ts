export interface PromiseResolver<T = void> {
  resolve: (v: T) => void
  reject: (reason: any) => void
  readonly promise: Promise<T>
}
