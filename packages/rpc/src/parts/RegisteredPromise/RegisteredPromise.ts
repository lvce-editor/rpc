export interface RegisteredPromise<T = unknown> {
  readonly id: number
  readonly promise: Promise<T>
}
