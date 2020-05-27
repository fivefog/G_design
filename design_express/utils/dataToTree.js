//把父子级数据转换成树形结构
function dataToTree(data) {
    let parents = data.filter(value => value.p_id === 'undefined' || value.p_id === null || value.p_id === '')
    let children = data.filter(value => value.p_id !== 'undefined' && value.p_id !== null && value.p_id !== '')
    let translator = (parents, children) => {
        parents.forEach((parent) => {
            children.forEach((current, index) => {
                if (current.p_id === parent.f_id) {
                    // 数组的深拷贝
                    let temp = JSON.parse(JSON.stringify(children))
                    temp.splice(index, 1)
                    translator([current], temp)
                    typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
                }
            })
        })
    }
    translator(parents, children)
    return parents
}


module.exports = dataToTree