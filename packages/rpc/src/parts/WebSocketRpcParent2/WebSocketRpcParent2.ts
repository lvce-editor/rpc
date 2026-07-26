import type { Rpc } from '../Rpc/Rpc.ts'
import * as GetWebSocketUrl from '../GetWebSocketUrl/GetWebSocketUrl.ts'
import * as Location from '../Location/Location.ts'
import * as WebSocketRpcParent from '../WebSocketRpcParent/WebSocketRpcParent.ts'

const reconnectDelay = 2000

const waitForReconnect = async (): Promise<void> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, reconnectDelay)
  })
}

const connect = async ({ commandMap, wsUrl }: { commandMap: any; wsUrl: string }): Promise<{ rpc: Rpc; webSocket: WebSocket }> => {
  const webSocket = new WebSocket(wsUrl)
  try {
    const rpc = await WebSocketRpcParent.create({
      commandMap,
      webSocket,
    })
    return {
      rpc,
      webSocket,
    }
  } catch (error) {
    webSocket.close()
    throw error
  }
}

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
  let connection
  try {
    connection = await connect({
      commandMap,
      wsUrl,
    })
  } catch {
    await waitForReconnect()
    connection = await connect({
      commandMap,
      wsUrl,
    })
  }
  if (onClose) {
    connection.webSocket.addEventListener('close', onClose, { once: true })
  }
  return connection.rpc
}
