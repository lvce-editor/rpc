/* eslint-disable n/no-unsupported-features/es-syntax */
import type { RegisteredPromise } from '../RegisteredPromise/RegisteredPromise.ts'
import * as Id from '../Id/Id.ts'

export const registerPromise = <T = unknown>(map: Record<number, (value: T) => void>): RegisteredPromise<T> => {
  const id = Id.create()
  const { promise, resolve } = Promise.withResolvers<T>()
  map[id] = resolve
  return { id, promise }
}
