export const isWorker = (value: any): boolean => {
  return value instanceof Worker
}
