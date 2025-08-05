import type { Rpc } from '../Rpc/Rpc.ts'

export interface RpcWithStdio extends Rpc {
  readonly stdout: ReadableStream
  readonly stderr: ReadableStream
}
