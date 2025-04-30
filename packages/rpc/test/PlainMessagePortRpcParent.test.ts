import { expect, test } from '@jest/globals'
import { create } from '../src/parts/PlainMessagePortRpcParent/PlainMessagePortRpcParent.ts'

test('create', async () => {
  const { port1, port2 } = new MessageChannel()

  const rpc = await create({
    commandMap: {},
    messagePort: port1,
  })

  expect(rpc).toBeDefined()
  expect(typeof rpc.invoke).toBe('function')
  expect(typeof rpc.send).toBe('function')
  expect(typeof rpc.invokeAndTransfer).toBe('function')
  expect(typeof rpc.dispose).toBe('function')

  await rpc.dispose()
  port1.close()
  port2.close()
})
