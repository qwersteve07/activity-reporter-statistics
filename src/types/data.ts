export type CatagType = {
  name: string,
  groups: Array<GroupType>
}

export type GroupType = {
  checked?: boolean,
  name: string,
  reporters: Array<ReporterType>
}

export enum ReporterStatus{
  UNKNOWN= 'unknown',
  ATTEND = 'attend',
  NOT_ATTENDING = 'not-attending',
  NO_ANSWER = 'no-answer'
}

export type ReporterType = {
  checked?: boolean,
  name: string,
  mobile: string,
  custom?: boolean
  status?: ReporterStatus
}