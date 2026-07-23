import type { Rpc } from '../Rpc/Rpc.ts'
import * as GetWebSocketUrl from '../GetWebSocketUrl/GetWebSocketUrl.ts'
import * as Location from '../Location/Location.ts'
import * as WebSocketRpcParent from '../WebSocketRpcParent/WebSocketRpcParent.ts'

export const create = async ({
  commandMap,
  onClose,
  type,
}: {
  commandMap: any
  onClose?: () => void
  type: string
}): Promise<Rpc> => {
  const host = Location.getHost()
  const protocol = Location.getProtocol()
  const wsUrl = GetWebSocketUrl.getWebSocketUrl(type, host, protocol)
  const webSocket = new WebSocket(wsUrl)
  if (onClose) {
    webSocket.addEventListener('close', onClose, { once: true })
  }
  const rpc = await WebSocketRpcParent.create({
    commandMap,
    webSocket,
  })
  return rpc
}
