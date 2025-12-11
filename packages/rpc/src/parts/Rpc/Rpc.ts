export interface Rpc {
  readonly dispose: () => Promise<void>
  readonly invoke: (method: string, ...params: any[]) => Promise<any>
  readonly invokeAndTransfer: (method: string, ...params: any[]) => Promise<any>
  readonly send: (method: string, ...params: any[]) => void
}
