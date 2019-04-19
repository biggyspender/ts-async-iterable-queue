import { createPushAsyncIterable } from '../src/ts-async-iterable-queue'
describe('createPushAsyncIterable', () => {
  it('works', async () => {
    const q = createPushAsyncIterable<number>(({ next, complete }) => {
      next(1)
      complete()
    })
    const a: number[] = []
    for await (const x of q) {
      a.push(x)
    }
    expect(a).toEqual([1])
  })
  it('works2', async () => {
    const q = createPushAsyncIterable<number>(({ next, error }) => {
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
  it('works3', async () => {
    let isCompleted = false
    const q = createPushAsyncIterable<number>(({ next, complete, addCompletionHandler }) => {
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
  it('works4', async () => {
    let isCompleted = false
    const q = createPushAsyncIterable<number>(({ next, error, addCompletionHandler }) => {
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
  it('works5', async () => {
    let isCompleted = false
    const q = createPushAsyncIterable<number>(({ next, addCompletionHandler }) => {
      next(1)
      next(1)
      next(1)

      addCompletionHandler(() => (isCompleted = true))
    })

    for await (const _ of q) {
      break
    }
    expect(isCompleted).toBeTruthy()
  })
  it('works6', async () => {
    let isCompleted = false
    const q = createPushAsyncIterable<number>(({ next, addCompletionHandler }) => {
      next(1)
      next(1)
      next(1)

      addCompletionHandler(() => (isCompleted = true))
    })

    for await (const _ of q) {
      break
    }
    expect(isCompleted).toBeTruthy()
  })
})
