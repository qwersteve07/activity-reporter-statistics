const formatMobile = (mobile: string) => {
    return mobile.replaceAll('-', '').padStart(10, '0')
}

export const parseCsvToData = (data: any) => {
    let catags: any = {}

    data.forEach((d: any) => {
        let catagName = d['分類']
        if (!catags[catagName]) {
            catags[catagName] = [d]
        } else {
            catags[d['分類']].push(d)
        }
    })

    let result = []

    Object.entries(catags).forEach(c => {
        const groupsArr: any = c[1]
        let groups: any = {}
        groupsArr.forEach((g: any) => {
            const mediaName = g['媒體']
            if (!groups[mediaName]) {
                groups[mediaName] = {
                    name: mediaName,
                    reporters: [{
                        name: g['名字'],
                        mobile: formatMobile(g['電話'])
                    }]
                }
            } else {
                groups[mediaName].reporters.push({
                    name: g['名字'],
                    mobile: formatMobile(g['電話'])
                })
            }
        })

        result.push({
            name: c[0],
            group: Object.values(groups)
        })
    })

    return result
}