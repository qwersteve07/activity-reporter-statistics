export type CatagType = {
    name: string,
    groups: Array<GroupType>
}

export type GroupType = {
  checked?: boolean,
  name: string,
  reporters: Array<ReporterType>
}

export type ReporterType = {
  checked?: boolean,
  name: string,
  mobile: string
}