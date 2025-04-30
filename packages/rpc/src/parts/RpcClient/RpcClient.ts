import type { Rpc } from '../Rpc/Rpc.ts'
import type { RpcClientOptions } from '../RpcClientOptions/RpcClientOptions.ts'

export interface RpcClient<T extends RpcClientOptions> {
  readonly create: (options: T) => Promise<Rpc>
}
