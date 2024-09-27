import { CatagType, GroupType } from "./types/data"
import { RowType } from "./types/rawData"

const formatMobile = (mobile: string) => {
    return mobile.replaceAll('-', '').padStart(10, '0')
}

export const parseCsvToData = (data: Array<RowType>) => {
    const catags: {[key: string]: Array<RowType>} = {}

    data.forEach((d: RowType) => {
        const catagName = d['分類']
        if (!catags[catagName]) {
            catags[catagName] = [d]
        } else {
            catags[d['分類']].push(d)
        }
    })

    const result: Array<CatagType> = []

    Object.entries(catags).forEach(c => {
        const RowArr: Array<RowType> = c[1]
        const groups: {[key:string]: GroupType} = {}
        RowArr.forEach((row: RowType) => {
            const mediaName = row['媒體']
            if (!groups[mediaName]) {
                groups[mediaName] = {
                    name: mediaName,
                    reporters: [{
                        name: row['名字'],
                        mobile: formatMobile(row['電話'])
                    }]
                }
            } else {
                groups[mediaName].reporters.push({
                    name: row['名字'],
                    mobile: formatMobile(row['電話'])
                })
            }
        })

        result.push({
            name: c[0],
            groups: Object.values(groups)
        })
    })

    return result
}