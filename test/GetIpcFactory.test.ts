import { expect, test } from '@jest/globals'
import * as GetIpcFactory from '../src/parts/GetIpcFactory/GetIpcFactory.js'
import { IpcChildWithElectronMessagePort } from '@lvce-editor/ipc'

test('getIpcFactory - returns correct factory for IpcChildWithElectronMessagePort', () => {
  const factory = GetIpcFactory.getIpcFactory({
    ipcMethod: 'IpcChildWithElectronMessagePort',
  })
  expect(factory).toBe(IpcChildWithElectronMessagePort)
})

test('getIpcFactory - throws for invalid ipc method', () => {
  expect(() => {
    GetIpcFactory.getIpcFactory({
      ipcMethod: 'invalid',
    })
  }).toThrow('unsupported ipc method')
})
