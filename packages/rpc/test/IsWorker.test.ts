import { test, expect } from '@jest/globals'
import { isWorker } from '../src/parts/IsWorker/IsWorker.ts'

// Mock Worker class for testing
class MockWorker {
  constructor(scriptURL: string) {
    // Mock implementation
  }
}

// Mock global Worker
global.Worker = MockWorker as any

test('should return true for Worker instances', () => {
  const worker = new Worker('data:text/javascript,')
  expect(isWorker(worker)).toBe(true)
})

test('should return false for non-Worker values', () => {
  expect(isWorker(null)).toBe(false)
  expect(isWorker(undefined)).toBe(false)
  expect(isWorker('string')).toBe(false)
  expect(isWorker(123)).toBe(false)
  expect(isWorker({})).toBe(false)
  expect(isWorker([])).toBe(false)
  expect(isWorker(() => {})).toBe(false)
  expect(isWorker(new Date())).toBe(false)
  expect(isWorker(new Error())).toBe(false)
})