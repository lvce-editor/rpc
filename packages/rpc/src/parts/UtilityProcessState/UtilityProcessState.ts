import * as Assert from '@lvce-editor/assert'

export const state = {
  all: Object.create(null),
}

export const add = (pid: number, process: any, name: string): void => {
  Assert.number(pid)
  Assert.object(process)
  Assert.string(name)
  state.all[pid] = {
    name,
    process,
  }
}

export const remove = (pid: number): void => {
  Assert.number(pid)
  delete state.all[pid]
}

export const getAll = (): any => {
  return Object.entries(state.all)
}

export const getByName = (name: string): any => {
  for (const value of Object.values(state.all)) {
    // @ts-ignore
    if (value.name === name) {
      // @ts-ignore
      return value.process
    }
  }
  return undefined
}
