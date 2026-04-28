// 导入axios封装文件
import request from '@/utils/request'

//查询权限菜单列表
export const getRulesListFn = () => {
    return request({
        url: 'admin/rule/1',
        method: 'GET'
    })
}

// 新增菜单权限
export const InsertRuleFn = (data) =>{
    return request({
        url : 'admin/rule',
        method : 'POST',
        data,
    })
}