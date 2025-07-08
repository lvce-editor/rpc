import { test, expect } from '@jest/globals'
import { create } from '../src/parts/TransferMessagePortRpcParent/TransferMessagePortRpcParent.ts'

test('should create RPC with transferred message port', async () => {
  let capturedPort: MessagePort | null = null
  const mockSend = (port: MessagePort): Promise<void> => {
    capturedPort = port
    return Promise.resolve()
  }
  const commandMap = {}

  const result = await create({
    commandMap,
    send: mockSend,
  })

  expect(capturedPort).toBeInstanceOf(MessagePort)
  expect(result).toBeDefined()
  expect(typeof result.send).toBe('function')
  expect(typeof result.invoke).toBe('function')
  expect(typeof result.invokeAndTransfer).toBe('function')
  expect(typeof result.dispose).toBe('function')
})

const mockSend = (port: MessagePort): Promise<void> => {
  return Promise.reject(new Error('Send failed'))
}

test('should handle send function that throws error', async () => {
  const commandMap = {}

  await expect(
    create({
      commandMap,
      send: mockSend,
    }),
  ).rejects.toThrow('Send failed')
})
