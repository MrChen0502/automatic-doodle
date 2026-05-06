// 导入axios封装文件
import request from '@/utils/request'

// 获取角色列表
/** page参数：页码，地址栏参数 */
export const getRoleListFn = (page)=>{
    return request({
        url : `admin/role/${page}`,
        method : 'GET'
    })
}

// 新增角色
/** data参数:角色名称等提交的数据 */
export const InsertRoleFn = (data)=>{
    return request({
        url : `admin/role`,
        method : 'POST',
        data,
    })
}

// 编辑角色
/**  id参数：角色ID，地址栏参数；data参数；提交角色名称等数据，body参数 */
export const EditRoleFn = (id , data)=>{
    return request({
        url : `admin/role/${id}`,
        method : 'POST',
        data
    })
}

// 删除角色
/** id参数：角色ID，地址栏参数 */
export const  DelRoleFn= (id)=>{
    return request({
        url : `admin/role/${id}/delete`,
        method : 'POST',
    })
}

// 修改角色启动状态
/** id参数：角色ID，地址栏参数；status参数：角色状态，data参数 */
export const EditRoleStatusFn = (id,status)=>{
    return request({
        url : `admin/role/${id}/update_status`,
        method : 'POST',
        data : {
            status
        }
    })
}

// 根据角色分配权限
/**id参数：角色ID；role_ids参数：一个数组包裹选中的权限ID */
export const setRolesFn = (id , rule_ids)=>{
    return request({
        url : `admin/role/set_rules`,
        method : 'POST',
        data : {
            id,
            rule_ids
        }
    })
}