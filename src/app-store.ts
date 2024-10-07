import { create } from 'zustand'
import { CatagType } from './types/data'

interface AppState {
  data: Array<CatagType>
  setData: (newData: Array<CatagType>) => void
}

const useAppStore = create<AppState>((set) => ({
    data: [],
    setData: (newData: Array<CatagType>)=> set({data: newData})
}))


export default useAppStore