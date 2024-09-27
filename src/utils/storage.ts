import { CatagType } from "../types/data"

export const sessionSaveData = (data: Array<CatagType>)=>{
    sessionStorage.setItem('activityData',JSON.stringify(data))
}

export const sessionGetData = ()=>{
    const dataString = sessionStorage.getItem('activityData')
    return dataString ? JSON.parse(dataString) : ''
}