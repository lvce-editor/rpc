import type { Rpc } from '../Rpc/Rpc.ts'

export interface RpcWithStdio extends Rpc {
  readonly stderr: ReadableStream
  readonly stdout: ReadableStream
}
