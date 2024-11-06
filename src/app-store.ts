import { create } from 'zustand'
import { CatagType } from './types/data'
import { sessionSaveData } from './utils/storage'

interface AppState {
  data: Array<CatagType>
  setData: (newData: Array<CatagType>) => void
}

const useAppStore = create<AppState>((set) => ({
  data: [],
  setData: (newData: Array<CatagType>) => {
    sessionSaveData(newData);
    set({ data: newData })
  }
}))


export default useAppStore