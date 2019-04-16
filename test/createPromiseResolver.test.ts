import { createPromiseResolver } from '../src/createPromiseResolver'
import { delay } from './delay'
describe('createQueue', () => {
  it('resolves correctly', async () => {
    const pr = createPromiseResolver<number>()
    // tslint:disable-next-line: no-floating-promises
    delay(5).then(() => pr.resolve(1))
    const v = await pr.promise
    expect(v).toBe(1)

    const pr1 = createPromiseResolver<number>()
    // tslint:disable-next-line: no-floating-promises
    delay(5).then(() => pr1.reject(Error('foo')))
    try {
      await pr1.promise
    } catch (error) {
      expect(error.message).toBe('foo')
      return
    }
    throw Error('unexpected')
  })
})
