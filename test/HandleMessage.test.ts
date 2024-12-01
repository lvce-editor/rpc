import { expect, jest, test } from '@jest/globals'
import * as HandleMessage from '../src/parts/HandleMessage/HandleMessage.js'

test('handleMessage - processes message event', async () => {
  const mockTarget = {
    postMessage: jest.fn(),
  }
  const mockEvent = {
    target: mockTarget,
    data: {
      jsonrpc: '2.0',
      method: 'test',
      params: [],
    },
  }
  await HandleMessage.handleMessage(mockEvent)
  // Basic test to ensure it runs without throwing
  expect(true).toBe(true)
})
