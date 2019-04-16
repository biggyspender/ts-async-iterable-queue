import { createAsyncQueue } from '../src/ts-async-iterable-queue'
import { delay } from './delay'

describe('createAsyncQueue', () => {
  it('r', async () => {
    const q = createAsyncQueue<number>()
    for (let x = 0; x < 10000; ++x) {
      q.enqueue(x)
    }

    q.complete()
    let i = 0
    for await (const ii of q) {
      expect(ii).toBe(i++)
    }
    expect(i).toBe(10000)
  })
  it('r2', async () => {
    const q = createAsyncQueue<number>()
      // tslint:disable-next-line: no-floating-promises
    ;(async () => {
      for (let x = 0; x < 100; ++x) {
        await delay(1)
        q.enqueue(x)
      }

      q.complete()
    })()

    let i = 0
    for await (const ii of q) {
      expect(ii).toBe(i++)
    }
    expect(i).toBe(100)
  })
  it('r3', async () => {
    const q = createAsyncQueue<number>()
    q.enqueue(1)
    const v = await q.dequeue()
    expect(v).toBe(1)
    q.complete()
    try {
      await q.dequeue()
    } catch (err) {
      expect(err.message).toBe('queue is complete')
      return
    }
    throw Error("this shouldn't happen")
  })
})
