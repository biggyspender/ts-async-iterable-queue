import { createQueue } from '../src/ts-async-iterable-queue'

describe('createQueue', () => {
  it('trims correctly', () => {
    const q = createQueue<number>(9999)
    for (let i = 0; i < 10000000; ++i) {
      q.enqueue(i)
      if (q.dequeue() !== i) throw Error()
      if (q.length !== 0) throw Error()
    }
  })
  it('length', () => {
    const q = createQueue<number>()
    for (let i = 0; i < 1000000; ++i) {
      q.enqueue(i)
    }
    expect(q.length).toBe(1000000)
    while (q.length > 0) {
      q.dequeue()
    }
  })
  it('empty', () => {
    const q = createQueue<number>()
    expect(q.dequeue()).toBeUndefined()
  })
})
