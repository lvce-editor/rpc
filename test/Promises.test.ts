import { expect, test } from '@jest/globals'
import * as Promises from '../src/parts/Promises/Promises.js'

test('withResolvers - creates promise with resolver', async () => {
  const { promise, resolve } = Promises.withResolvers()
  expect(promise).toBeInstanceOf(Promise)
  expect(typeof resolve).toBe('function')
})

test('withResolvers - resolver resolves the promise', async () => {
  const { promise, resolve } = Promises.withResolvers()
  // @ts-ignore
  resolve(42)
  const result = await promise
  expect(result).toBe(42)
})
