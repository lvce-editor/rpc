export interface Rpc {
  readonly send: (method: string, ...params: any[]) => void
  readonly invoke: (method: string, ...params: any[]) => Promise<any>
  readonly invokeAndTransfer: (method: string, ...params: any[]) => Promise<any>
  readonly dispose: () => Promise<void>
}
