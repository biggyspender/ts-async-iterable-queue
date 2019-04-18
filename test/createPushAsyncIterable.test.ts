import { createPushAsyncIterable } from '../src/createPushAsyncIterable'
describe('createPushAsyncIterable', () => {
  it('works', async () => {
    const q = createPushAsyncIterable<number>((next, complete, error, addCompletionHandler) => {
      next(1)
      complete()
    })
    const a: number[] = []
    for await (const x of q) {
      a.push(x)
    }
    expect(a).toEqual([1])
  })
  it('works', async () => {
    const q = createPushAsyncIterable<number>((next, complete, error, addCompletionHandler) => {
      next(1)
      error(Error('woo'))
      // onComplete(() => isCompleted = true)
    })

    const a: number[] = []
    try {
      for await (const x of q) {
        a.push(x)
      }
      throw Error('doo')
    } catch (e) {
      expect(e.message).toBe('woo')
    }
    expect(a).toEqual([1])
  })
  it('works', async () => {
    let isCompleted = false
    const q = createPushAsyncIterable<number>((next, complete, error, addCompletionHandler) => {
      next(1)
      complete()
      expect(addCompletionHandler).toBeDefined()
      addCompletionHandler(() => (isCompleted = true))
    })

    const a: number[] = []
    for await (const x of q) {
      a.push(x)
    }
    expect(isCompleted).toBeTruthy()
    expect(a).toEqual([1])
  })
  it('works', async () => {
    let isCompleted = false
    const q = createPushAsyncIterable<number>((next, complete, error, addCompletionHandler) => {
      next(1)
      error(Error('woo'))
      addCompletionHandler(() => (isCompleted = true))
    })

    const a: number[] = []
    try {
      for await (const x of q) {
        a.push(x)
      }
      throw Error('doo')
    } catch (e) {
      expect(e.message).toBe('woo')
    }
    expect(isCompleted).toBeTruthy()
    expect(a).toEqual([1])
  })
})
