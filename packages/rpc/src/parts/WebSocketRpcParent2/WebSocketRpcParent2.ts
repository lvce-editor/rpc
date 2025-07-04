import * as GetWebSocketUrl from '../GetWebSocketUrl/GetWebSocketUrl.ts'
import * as Location from '../Location/Location.ts'
import * as WebSocketRpcParent from '../WebSocketRpcParent/WebSocketRpcParent.ts'
import type { Rpc } from '../Rpc/Rpc.ts'

export const create = async ({ commandMap }: { commandMap: any }): Promise<Rpc> => {
  const host = Location.getHost()
  const protocol = Location.getProtocol()
  const wsUrl = GetWebSocketUrl.getWebSocketUrl('search-process', host, protocol)
  const webSocket = new WebSocket(wsUrl)
  const rpc = await WebSocketRpcParent.create({
    webSocket,
    commandMap,
  })
  return rpc
}
