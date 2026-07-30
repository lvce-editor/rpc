import * as Assert from '@lvce-editor/assert'

const state = {
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
