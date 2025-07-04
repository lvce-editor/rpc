import { expect, test } from '@jest/globals'
import * as GetWebSocketUrl from '../src/parts/GetWebSocketUrl/GetWebSocketUrl.ts'

test('getWebSocketUrl - with http protocol', () => {
  const processId = 'test-process'
  const host = 'localhost:3000'
  const protocol = 'http:'
  const url = GetWebSocketUrl.getWebSocketUrl(processId, host, protocol)
  expect(url).toBe('ws://localhost:3000/websocket/test-process')
})

test('getWebSocketUrl - with https protocol', () => {
  const processId = 'test-process'
  const host = 'example.com'
  const protocol = 'https:'
  const url = GetWebSocketUrl.getWebSocketUrl(processId, host, protocol)
  expect(url).toBe('wss://example.com/websocket/test-process')
})

test('getWebSocketUrl - with custom port', () => {
  const processId = 'test-process'
  const host = 'localhost:8080'
  const protocol = 'http:'
  const url = GetWebSocketUrl.getWebSocketUrl(processId, host, protocol)
  expect(url).toBe('ws://localhost:8080/websocket/test-process')
})
