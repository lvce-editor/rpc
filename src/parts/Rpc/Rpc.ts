export interface Rpc {
  readonly send: (method: string, ...params: any[]) => void
  readonly invoke: (method: string, ...params: any[]) => Promise<void>
  readonly invokeAndTransfer: (method: string, ...params: any[]) => Promise<void>
}
