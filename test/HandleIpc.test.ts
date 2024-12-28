import { expect, jest, test } from '@jest/globals'
import * as HandleIpc from '../src/parts/HandleIpc/HandleIpc.js'
import * as HandleMessage from '../src/parts/HandleMessage/HandleMessage.js'

test('handleIpc - with addEventListener', () => {
  const mockIpc = {
    addEventListener: jest.fn(),
  }
  HandleIpc.handleIpc(mockIpc)
  expect(mockIpc.addEventListener).toHaveBeenCalledWith('message', HandleMessage.handleMessage)
})

test('handleIpc - with on method', () => {
  const mockIpc = {
    on: jest.fn(),
  }
  HandleIpc.handleIpc(mockIpc)
  expect(mockIpc.on).toHaveBeenCalledWith('message', HandleMessage.handleMessage)
})
