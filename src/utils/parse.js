function compare(property, desc) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        if (desc == true) {
            // 升序排列
            return value1 - value2;
        } else {
            // 降序排列
            return value2 - value1;
        }
    }
}
export function exchangeObj(params) {
    if (!params) return;
    let sortObj = params.sort(compare('id', true))
    let o = {}, arr = [];
    sortObj.map(obj => {
        if (o[obj.id]) { //说明存在
            o[obj.id].push(obj)
        } else {
            o[obj.id] = [obj]
        }
    })
    let b = Object.values(o)
    b.map((obj, i) => {
        arr.push({
            id: obj[0].id,
            type_name: obj[0].type_name,
            type_name_en: obj[0].type_name_en,
            project: obj
        })
    })
    return arr;
}