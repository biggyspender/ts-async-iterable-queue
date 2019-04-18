import { PromiseResolver } from './PromiseResolver'

export const createPromiseResolver = <T = void>(): PromiseResolver<T> => {
  let resolve: ((v: T) => void) | null = null
  let reject: ((reason: any) => void) | null = null
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return {
    resolve: resolve!,
    reject: reject!,
    promise
  }
}
