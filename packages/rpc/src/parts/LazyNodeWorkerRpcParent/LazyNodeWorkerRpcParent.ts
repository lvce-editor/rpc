import type { Rpc } from '../Rpc/Rpc.ts'
import * as NodeWorkerRpcParent from '../NodeWorkerRpcParent/NodeWorkerRpcParent.ts'
import { createSharedLazyRpc } from '../SharedLazyRpc/SharedLazyRpc.ts'

export const create = ({
  argv,
  commandMap,
  env,
  execArgv,
  path,
  stdio,
}: {
  commandMap: any
  argv?: readonly string[]
  execArgv?: readonly string[]
  path: string
  stdio?: string
  env?: any
}): Rpc => {
  return createSharedLazyRpc(() => {
    return NodeWorkerRpcParent.create({
      argv,
      commandMap,
      env,
      execArgv,
      path,
      stdio,
    })
  })
}
