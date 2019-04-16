import { IteratorResultResolver } from './IteratorResultResolver'
export type ResultWaitingForResolver<T> = (v: IteratorResultResolver<T>) => void
